import React, { useState } from "react"
import axios, { AxiosError, AxiosRequestConfig } from 'axios'
import Link from "next/link"

function VideoUpload() {
    const [file, setFile] = useState<File | undefined>()
    const [progress, setProgress] = useState(0)
    const [error, setError] = useState(null)
    const [submitting, setSubmitting] = useState(false)
    const [fileName, setFileName] = useState('')
    const [showLink, setShowLink] = useState(false)
    const [btnDisabled, setBtnDisabled] = useState(true)

    async function handleSubmit() {
        const data = new FormData() 

        if(!file) return

        setSubmitting(true)
        
        data.append('file', file)

        const config: AxiosRequestConfig = {
            onUploadProgress: function (progressEvent){
                const percentComplete = Math.round((progressEvent.loaded * 100) / progressEvent.total)
                setProgress(percentComplete)
            }
        }

        try {
            await axios.post('/api/videos', data, config)
        } catch(e :any) {
            setError(e.message)
        } finally {
            setSubmitting(false)
            setProgress(0)
            setShowLink(true)
            setBtnDisabled(true)
        }

    }

    function handleSetFile(event: React.ChangeEvent<HTMLInputElement>){
        const files = event.target.files 

        if(files?.length){
            setFile(files[0]);
            setFileName(files[0].name.replace('.mp4', ''))
            setBtnDisabled(false)
        }
    }

    return (
        <div className="form">
            {error && <p>{error}</p>}
            {submitting && <p className="progress">{progress}%</p>}
            <form action="POST">
                <div className="input">
                    <label htmlFor="file">Select File</label>
                    <input type="file" id="file" accept=".mp4" onChange={handleSetFile}/>
                </div>
            </form>
            {showLink ? (<Link href={`videos/${fileName}`}><a className="link">View Video</a></Link>) : (btnDisabled ? (<button onClick={handleSubmit} className='button' disabled>Upload Video</button>) : <button onClick={handleSubmit} className='button'>Upload Video</button>)}
        </div>
    )
}

export default VideoUpload