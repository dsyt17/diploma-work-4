from keras.models import load_model
import cv2
import numpy as np
import os.path
import sys

model = load_model(r'../models/tf-srgan/final_model.h5')
error = False

if len(sys.argv) > 1:
    file = sys.argv[1]
else:
    error = True
    print('No path')


def single_predict(path, save=False):
    if not os.path.exists(path):
        print('No such file: ' + path)
        return

    SIZE = 256
    img = cv2.imread(path, 1)
    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    img = cv2.resize(img, (SIZE, SIZE))
    img = img.astype('float32') / 255.0

    predicted = np.clip(model.predict(img.reshape(
        1, SIZE, SIZE, 3)), 0.0, 1.0).reshape(SIZE, SIZE, 3)

    if save:
        file_name = 'predicted.jpg'
        cv2.imwrite(file_name, cv2.cvtColor(predicted*255, cv2.COLOR_BGR2RGB))


if not error:
    single_predict(file, 1)
