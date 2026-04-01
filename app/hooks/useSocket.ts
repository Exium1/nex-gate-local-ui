// import { useEffect, useRef, useCallback } from 'react'

// export function useSocket(onMessage: (msg: any) => void) {
//   const ws = useRef(null as WebSocket | null)

//   useEffect(() => {
//     const socket = new WebSocket(`ws://${location.host}/ws`)
//     ws.current = socket
//     socket.onmessage = (e) => onMessage(JSON.parse(e.data))
//     return () => socket.close()
//   }, [])

//   const send = useCallback((msg: any) => {
//     if (ws.current?.readyState === WebSocket.OPEN) {
//       ws.current.send(JSON.stringify(msg))
//     }
//   }, [])

//   return { send }
// }