import { useState } from "react";

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
    
    const handleSubmission = (event) => {
        console.log('done')
        event.preventDefault();
        setUploading(true);
        //axios stuff
        setUploading(false);
    }

    return (
        <form className={styles.card} onSubmit={(e) => e.preventDefault()}>
            {error.state && <p className={styles.error}>{error.message}</p>}
            <label for='upload'>Upload video :</label>
            <input type="file" name="upload" id='upload' className={styles.upload} onChange={changeHandler} />
            <button onClick={handleSubmission} disabled={error.state || !file} className={styles.btn}>Upload</button>
        </form>
    )
}

export default FileUpload;