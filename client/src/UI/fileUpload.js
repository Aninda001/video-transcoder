import { useState } from "react";
import axios from 'axios';

import styles from './fileUpload.module.css';

const format = ['mp4', 'm4v', 'mov', 'mpg', 'mpeg', 'avi', 'mkv', 'wmv', 'flv', 'webm', 'vob', 'evo', 'mts', 'm2ts'];

const FileUpload = () => {
    const [file, setFile] = useState('');
    const [error, setError] = useState({
        state: false,
        message: ''
    });
    const [uploading, setUploading] = useState(false);

    const changeHandler = (event) => {
        const ext = event.target.files[0].name.lastIndexOf('.');
        if (format.includes(event.target.files[0].name.slice(ext + 1).toLowerCase())) {
            setError({
                state: false,
                message: ''
            })
            setFile(event.target.files[0]);
        }
        else {
            setError({
                state: true,
                message: 'Unsopported file format'
            })
        }
    }

    const handleSubmission = async (event) => {
        event.preventDefault();
        setUploading(true);
        const formData = new FormData();
        formData.append('file',file)
        const prms = await axios.post('http://localhost:8000/upload',formData);
        console.log(prms.data.req);
        setUploading(false);
    }

    return (
        <form className={styles.card} encType="multipart/form-data" onSubmit={(e) => e.preventDefault()}>
            {error.state && <p className={styles.error}>{error.message}</p>}
            <label htmlFor='upload'>Upload video :</label>
            <input type="file" name="upload" id='upload' className={styles.upload} onChange={changeHandler} />
            <button onClick={handleSubmission} disabled={error.state || !file} className={styles.btn}>{uploading ? 'Uploading' : 'Upload' }</button>
        </form>
    )
}

export default FileUpload;