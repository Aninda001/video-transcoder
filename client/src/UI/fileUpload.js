import { useState } from "react";
import axios from 'axios';

import styles from './fileUpload.module.css';

const format = ['mp4', 'm4v', 'mov', 'mpg', 'mpeg', 'avi', 'mkv', 'wmv', 'flv', 'webm', 'vob', 'evo', 'mts', 'm2ts'];

const FileUpload = () => {
    const [file, setFile] = useState('');
    const [codec, setCodec] = useState('mp4');
    const [error, setError] = useState({
        state: false,
        message: ''
    });
    const [uploading, setUploading] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [download, setDownload] = useState(false);
    const [downloadUrl, setDownloadUrl] = useState();

    const changeHandler = (event) => {
        setDownload(false);
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

    const downloadHandler = async () => {
        window.location.assign('http://localhost:8000/download/' + downloadUrl);
    }

    const handleSubmission = async (event) => {
        setDownload(false);
        event.preventDefault();
        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('codec', codec);
        const prms = await axios.post('http://localhost:8000/upload', formData, {
            onUploadProgress: progressEvent => {
                let percentComplete = progressEvent.loaded / progressEvent.total;
                percentComplete = parseInt(percentComplete * 100);
                if (percentComplete === 100) {
                    setUploading(false);
                    setProcessing(true);
                }
            }
        });
        setProcessing(false);
        setDownload(true);
        setDownloadUrl(prms.data.path);
    }

    let txt = '';
    if (uploading) {
        txt = 'Uploading...';
    }
    else if (processing) {
        txt = 'Processing...';
    }
    else {
        txt = 'Upload';
    }

    const codecHandler = (event) => {
        setCodec(event.target.value);
    }

    return (
        <form className={styles.card} onSubmit={(e) => e.preventDefault()}>
            {error.state && <p className={styles.error}>{error.message}</p>}
            <div>
                <label htmlFor='upload'>Upload video : </label>
                <input type="file" name="upload" id='upload' required
                    className={styles.upload} onChange={changeHandler} />
            </div>
            <div>
                <label htmlFor="languages">Select format : </label>
                <select name="language" id="language" required onChange={codecHandler}>
                    {format.map(ver => {
                        return (
                            <option key={ver.toLowerCase()}>
                                {ver.toLowerCase()}
                            </option>
                        )
                    })}
                </select>
            </div>
            <button onClick={handleSubmission} disabled={error.state || !file || uploading || processing}
                className={styles.btn}>{txt}
            </button>
            {download && <button onClick={downloadHandler} className={styles.btn}>Download</button>}
        </form>
    )
}

export default FileUpload;