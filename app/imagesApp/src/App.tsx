import React from 'react';

import { saveAs } from 'file-saver';

import styles from './app.module.scss';
import axios from './axios';
import { baseURL } from './axios';

enum options {
    res = 'resolution',
    color = 'colorization',
}

const App = () => {
    const [isLoading, setIsLoading] = React.useState(false);
    const [image, setImage] = React.useState(null);
    const [predictedImage, setPredictedImage] = React.useState(null);
    const [predictedProcessedImage, setPredictedProcessedImage] = React.useState(null);
    const [activeOption, setActiveOption] = React.useState(options.res);

    function handleFileInputChange(event: any) {
        setIsLoading(true);
        const file = event.target.files[0];

        const formData = new FormData();
        formData.append('image', file);

        axios
            .post(`/upload?type=${activeOption}`, formData)
            .then(response => {
                const data = response.data;
                setImage(data.link);
                setPredictedImage(data.predictedLink);
                setPredictedProcessedImage(data.predictedProcessedLink);
                setIsLoading(false);
            })
            .catch(error => {
                setIsLoading(false);
            });
    }

    return (
        <div className={styles.root}>
            Выберите картинку
            <div className={styles.options}>
                <div
                    className={activeOption === options.res ? styles.active : ''}
                    onClick={() => setActiveOption(options.res)}
                >
                    Увеличить разрешение
                </div>
                <div
                    className={activeOption === options.color ? styles.active : ''}
                    onClick={() => setActiveOption(options.color)}
                >
                    Колоризация
                </div>
            </div>
            {isLoading ? (
                <h1>Loading</h1>
            ) : (
                <>
                    <input
                        type="file"
                        onChange={handleFileInputChange}
                        accept="image/png, image/jpeg"
                    />
                    <div className={styles.images}>
                        {image && (
                            <div className={styles.item}>
                                <img src={baseURL + image} alt="image" />
                                <div onClick={() => saveAs(baseURL + image, image)}>
                                    image
                                </div>
                            </div>
                        )}
                        {predictedImage && (
                            <div className={styles.item}>
                                <img
                                    src={baseURL + predictedImage}
                                    alt="predictedImage"
                                />
                                <div
                                    onClick={() =>
                                        saveAs(baseURL + predictedImage, predictedImage)
                                    }
                                >
                                    predictedImage
                                </div>
                            </div>
                        )}
                        {predictedProcessedImage && (
                            <div className={styles.item}>
                                <img
                                    src={baseURL + predictedProcessedImage}
                                    alt="predictedProcessedImage"
                                />
                                <div
                                    onClick={() =>
                                        saveAs(
                                            baseURL + predictedProcessedImage,
                                            predictedProcessedImage,
                                        )
                                    }
                                >
                                    predictedProcessedImage
                                </div>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default App;
