# Create conda env:

conda create -n **name** python=3.10
conda env list
conda activate **name**
pip install ipykernel
python -m ipykernel install --user --name **name** --display-name "**name**"

# Start with Nvidia GPU

cuDNN CUDA
tensorflow-gpu
zlibwapi.dll

# Check GPU work

import tensorflow as tf
print("Num GPUs Available: ", len(tf.config.list_physical_devices('GPU')))
print(tf.config.list_physical_devices('GPU'))

from tensorflow.python.client import device_lib
print(device_lib.list_local_devices())

tf.test.is_built_with_cuda()

# Disable GPU (if u need)

CUDA_VISIBLE_DEVICES=""

# Hints for jupyter

pip install jupyter_contrib_nbextensions
jupyter contrib nbextension install --user
jupyter nbextension enable hinterland/hinterland

tensorboard --logdir runs
