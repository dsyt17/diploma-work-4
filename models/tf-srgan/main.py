import matplotlib.pyplot as plt
import cv2
import keras
import numpy as np

def single_predict(path, save=False):
    def plot_for_single(low,predicted):
        plt.figure(figsize=(15,15))
        plt.subplot(1,2,1)
        plt.title('Low Image ', color = 'black', fontsize = 20)
        plt.imshow(low)
        plt.subplot(1,2,2)
        plt.title('Predicted', color = 'green', fontsize = 20)
        plt.imshow(predicted)

        plt.show()

    SIZE = 256
    img = cv2.imread(path,1)
    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    img = cv2.resize(img, (SIZE, SIZE))
    img = img.astype('float32') / 255.0

    predicted = np.clip(model.predict(img.reshape(1,SIZE, SIZE,3)),0.0,1.0).reshape(SIZE, SIZE,3)

    plot_for_single(img, predicted)
    
    if save:
        file_name = 'predicted.jpg'
        cv2.imwrite(file_name, cv2.cvtColor(predicted*255, cv2.COLOR_BGR2RGB))

model = keras.models.load_model(r"final_model.h5")
single_predict('0.png', 1)