
import Quill, { Delta, Range } from 'quill';
import "quill/dist/quill.snow.css";
import { useEffect, useRef } from "react";
import "../css/quill.css"
import { useStore } from '../store/zustand';
import AuthService from '../services/user-service';
import { useParams } from 'react-router-dom';
import { io } from "socket.io-client"
import { jwtDecode } from "jwt-decode";
import QuillCursors from 'quill-cursors';
import type { TokenPayload } from '../interfaces/interfaces';
import { getColorForUser, releaseColorForUser } from '../store/colorLogic';
Quill.register('modules/cursors', QuillCursors);

const toolbarOptions = [
  ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
  ['blockquote', 'code-block'],
  ['link', 'image', 'video', 'formula'],

  [{ 'header': 1 }, { 'header': 2 }],               // custom button values
  [{ 'list': 'ordered'}, { 'list': 'bullet' }, { 'list': 'check' }],
  [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
  [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
  [{ 'direction': 'rtl' }],                         // text direction

  [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
  [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

  [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
  [{ 'font': [] }],
  [{ 'align': [] }],

  ['clean']                                         // remove formatting button
];




const QuillEditor = () => {
  const divRef = useRef<HTMLDivElement | null>(null)
  const quillRef = useRef<Quill | null>(null)
  const debounce = useRef<ReturnType<typeof setTimeout> | null>(null)
  
  // const[quill,setQuill] = useState<Quill | null>()
  // const[socket,setSocket] = useState<Socket | null >()

  const {documentId} = useParams()
  const numericdocumentId = Number(documentId)
  const token = useStore((state) => state.token)
  const decodedToken: TokenPayload = jwtDecode(token!)

  const content = useStore((state) => state.content)

  // const activeUsers = useStore((state) => state.activeUsers)
  const setActiveUsers = useStore((state) => state.setActiveUsers)

  const permissionOfuser = useStore((state) => state.permissionOfuser)

  const dataTobackend = () => {
    if (debounce.current) clearTimeout(debounce.current)
    try {
      debounce.current = setTimeout(() => {
        (async () => {
        const html = quillRef.current?.root.innerHTML as string
        await AuthService.updatedocument(token!, {numericdocumentId,content:html}) as any 
        })()
      },1000)
    } catch (error) {
      console.error(error)
      alert("error while sending data to backend")
    }
  }

  useEffect(() => {
    // Wait for permission to be loaded before initializing Quill
    if (!permissionOfuser) return;

    if (!quillRef.current) {
      quillRef.current = new Quill(divRef.current!,{
        theme: "snow",
        modules: {
          toolbar: permissionOfuser === "VIEW" ? false : toolbarOptions,
          cursors: {
            transformOnTextChange: true
          }
        }})
        console.log("PERMISSION:",permissionOfuser)
    }

    const socketServer = io(import.meta.env.VITE_URL,{
      auth: {
        token: token,
        documentId: documentId
      }
    })

    socketServer.on("connect", () => {
    console.log("Connected to server! Socket ID:", socketServer.id)
    })

    //get cursor instance
    const cursors = quillRef.current.getModule("cursors") as any

    const handleChange = (delta: Delta,_oldDelta: Delta, source: string) => {
      if (permissionOfuser === "VIEW") return;
      if (source !== "user") return
      socketServer.emit("send-changes",delta)

      const range = quillRef.current!.getSelection()
      if (range) {
        socketServer.emit("cursor-change",{
          userId: decodedToken.id,
          userEmail: decodedToken.email,
          range
        })
      }
      dataTobackend()
    }

    //send changes
    quillRef.current.on("text-change",handleChange)

    const receiveChange = (delta: Delta) => {
      quillRef.current!.updateContents(delta)
    }
    //receive changes
    socketServer.on("receive-changes",receiveChange)

    const handleSelectionChange = (range: Range,_oldRange: Range, source: string) => {
      if (source !== "user") return
      socketServer.emit("cursor-change",{
        // userId: AuthService.getCurrentUser().id,
        // username: AuthService.getCurrentUser().username
        userId: decodedToken.id,
        userEmail: decodedToken.email,
        range
      })
    }

    //send cursor changes
    quillRef.current.on("selection-change", handleSelectionChange)

    //receive cursor changes
    socketServer.on("cursor-update",({ userId, userEmail, range }) => {
      if (range === null) {
        cursors.removeCursor(userId)
        return
      }
      if (!cursors.cursors[userId]) {
        const userColor = getColorForUser(String(userId));
        cursors.createCursor(userId, userEmail, userColor)
      }
      cursors.moveCursor(userId, range)
    })

    //send user that joined
    socketServer.emit("join-document", {
      userId: decodedToken.id,
      userEmail: decodedToken.email
    })

    //receive active users list updates
    socketServer.on("active-users-update", (users: { userId: number; userEmail: string }[]) => {
      setActiveUsers(users);
    });

    return () => {
      quillRef.current?.off("text-change",dataTobackend)
      socketServer.off("receive-changes",receiveChange)
      socketServer.off("active-users-update")
      socketServer.disconnect()
      releaseColorForUser(String(decodedToken.id));
      if (debounce.current) clearTimeout(debounce.current)
      // Clear active users when component unmounts
      setActiveUsers([]);
    }
  },[permissionOfuser])

  useEffect(() => {
    if (permissionOfuser === "VIEW") {
        quillRef.current?.disable()
    } 
  },[permissionOfuser])

  const contentLoaded = useRef(false);
  useEffect(() => {
    if (quillRef.current && content && !contentLoaded.current) {
        quillRef.current.clipboard.dangerouslyPasteHTML(content)
        contentLoaded.current = true;
    }
  },[content])


  return (
    <>
     {permissionOfuser === "VIEW" && (
       <div style={{
         backgroundColor: '#f0f0f0',
         padding: '12px 20px',
         borderRadius: '4px',
         marginBottom: '10px',
         display: 'flex',
         alignItems: 'center',
         gap: '10px',
         border: '1px solid #d0d0d0'
       }}>
         <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
           <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
           <circle cx="12" cy="12" r="3"></circle>
         </svg>
         <span style={{ color: '#666', fontWeight: '500' }}>View Only Mode - You cannot edit this document</span>
       </div>
     )}
     <div ref={divRef} ></div>
    </>
   
  )
}

export default QuillEditor

