import module as _module
import numpy as np
import constant
import sys

sys.path.append('../')

import utils.ImageUtils as IGU


utils = IGU.ImageUtils()

random_image = np.random.rand(1, 400, 400, 3)

predict = _module.build_model.predict(random_image)

y_predict = utils.getlistargmax(predict)
y_predict_label = utils.getLabel(constant.root, constant.filename, np.absolute(y_predict))

print(y_predict_label)