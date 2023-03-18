### Create conda env:
```
conda create -n your_name python=3.10
conda env list
conda activate your_name
pip install ipykernel
python -m ipykernel install --user --name your_name --display-name "your_name"
```

### Start with Nvidia GPU
You need to install:
+ cuDNN CUDA
+ tensorflow-gpu
+ zlibwapi.dll

### Check GPU work
**TensorFlow:**
```Python
import tensorflow as tf
print("Num GPUs Available: ", len(tf.config.list_physical_devices('GPU')))
print(tf.config.list_physical_devices('GPU'))
```

```Python
from tensorflow.python.client import device_lib
print(device_lib.list_local_devices())
```

```Python
tf.test.is_built_with_cuda()
```

**PyTorch:**
```Python
if torch.cuda.is_available():
    print(f"CUDA version: {torch.version.cuda}")
    cuda_id = torch.cuda.current_device()
    print(f"ID of current CUDA device: {torch.cuda.current_device()}")
    print(f"Name of current CUDA device: {torch.cuda.get_device_name(cuda_id)}")
else: 
    print("CUDA not available")
```


### Disable GPU (if u need)

```Python
CUDA_VISIBLE_DEVICES=""
```

### Hints for jupyter

```
pip install jupyter_contrib_nbextensions
jupyter contrib nbextension install --user
jupyter nbextension enable hinterland/hinterland
```

```
tensorboard --logdir runs
```
