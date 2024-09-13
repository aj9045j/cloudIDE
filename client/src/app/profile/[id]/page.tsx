import React, { useEffect } from 'react'

export default function userProfile({params}:any) {


  return (
    <div>
      <h1>userprofile is {params.id}</h1>
    </div>
  )
}
