from flask import Flask
from flask_cors import CORS, cross_origin
from flask import request
import sys
from module.module import build_model, graph
import numpy as np
from PIL import Image
import module.constant as constant
sys.path.append('./')
import utils.ImageUtils as IGU


utils = IGU.ImageUtils()


app = Flask(__name__)
CORS(app)






@app.route("/recoginition", methods = ['POST', 'GET'])
@cross_origin()
def recoginition():
    if request.method == 'GET':
        return 'please upload file use post method'
    elif request.method == 'POST':
        f = request.files['image']
        imagedata = np.array(Image.open(f))
        imagedata = np.reshape(imagedata, (1, 400, 400, 3))
        print(build_model)
        with graph.as_default():
            predict = build_model.predict(imagedata)

        y_predict = utils.getlistargmax(predict)
        y_predict_label = utils.getLabel(constant.root, constant.filename, np.absolute(y_predict))
        return  y_predict_label

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=80)