import React from 'react'
import {useMoralis} from "react-moralis"

function Navbar() {
  const { enableWeb3 } = useMoralis()
   
  return (
    <div>Navbar</div>
  )
}

export default Navbar