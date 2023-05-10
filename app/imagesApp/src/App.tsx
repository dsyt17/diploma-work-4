import React from 'react';

import { saveAs } from 'file-saver';

import styles from './app.module.scss';
import axios from './axios';
import { baseURL } from './axios';
import Download from './components/icons/Download.icon';

enum options {
    res = 'resolution',
    color = 'colorization',
}

const App = () => {
    const [isLoading, setIsLoading] = React.useState(false);

    // Локалиные состояния (стейты) для хранения изображений
    const [image, setImage] = React.useState(null);
    const [predictedImage, setPredictedImage] = React.useState(null);
    const [predictedProcessedImage, setPredictedProcessedImage] = React.useState(null);
    const [activeOption, setActiveOption] = React.useState(options.res);

    // Выполняется при выборе изображения
    const handleFileInputChange = (event: any) => {
        // Рендерим значек загрузки на время выполнения запроса
        setIsLoading(true);

        // Получаем изображение
        const file = event.target.files[0];

        // Создаем объект для отправки изображения
        const formData = new FormData();
        formData.append('image', file);

        // Выполняем post запрос на определенный на сервере эндпоинт
        axios
            .post(`/upload?type=${activeOption}`, formData)
            .then(response => {
                // Заполняем локальные стейты ссылками на сгенерированные изображения
                const data = response.data;
                setImage(data.link);
                setPredictedImage(data.predictedLink);
                setPredictedProcessedImage(data.predictedProcessedLink);
                setIsLoading(false);
            })
            .catch(error => {
                setIsLoading(false);
            });
    };

    return (
        <div className={styles.root}>
            <div className={styles.header}>Выберите картинку</div>
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
                    <label className={styles.input_file}>
                        <input
                            type="file"
                            name="file"
                            accept="image/png, image/jpeg"
                            onChange={handleFileInputChange}
                        />
                        <span className={styles.input_file_btn}>Выберите файл</span>
                        <span className={styles.input_file_text}>png или jpeg</span>
                    </label>
                    <div className={styles.images}>
                        {image && (
                            <div className={styles.item}>
                                <img src={baseURL + image} alt="image" />
                                <div
                                    className={styles.load}
                                    onClick={() => saveAs(baseURL + image, image)}
                                >
                                    <Download />
                                    Начальная картинка
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
                                    className={styles.load}
                                    onClick={() =>
                                        saveAs(baseURL + predictedImage, predictedImage)
                                    }
                                >
                                    <Download />
                                    U-net
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
                                    className={styles.load}
                                    onClick={() =>
                                        saveAs(
                                            baseURL + predictedProcessedImage,
                                            predictedProcessedImage,
                                        )
                                    }
                                >
                                    <Download />
                                    U-net + OpenCV
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
