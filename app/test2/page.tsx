import React from 'react'

const page = () => {
  return (
    <div className=" overflow-hidden w-screen h-screen">
    {/* {form_title} */}
    <iframe
        className=" w-full h-full overflow-hidden"
        src={`http://localhost:3000/projects/6797396b549baf1f96becb8c/form/by-title/bookmystudio-vendor-onboarding-form`}
      ></iframe>
  </div>
  )
}

export default page