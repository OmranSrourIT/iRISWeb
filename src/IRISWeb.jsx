import { Component, createElement } from "react";
import axios from "axios"; 
import "./ui/IRISWeb.css";
import { AiFillSave } from 'react-icons/ai';
import { AiFillCamera } from 'react-icons/ai';
import { AiOutlineCheckCircle } from 'react-icons/ai';

export class IRISWeb extends Component {
    constructor(props) {
        super(props);
        this.state = {
            WindowsApiUrlOpenDevice_Capture: "http://localhost:1234/api/Home/OpenDeviceIRIS_Capture",
            WindowsApiUrlIrisCapture: `http://localhost:1234/api/Home/IrisCapture?WhichEye=2&QualityValue=${this.props.QualityValue}`,
            ShowpageloaddivLeft: false,
            ShowpageloaddivRight: false,
            ImageIRIS_Right: "./img/Service$ImageIntegration$Iris2Widget.jpg",
            ImageIRIS_Left: "./img/Service$ImageIntegration$Iris2Widget.jpg",
            ResponseMessageQuailityEyes: "",
            DivMessgaBox: false,
            QuiltyRight: "",
            QuiltyLeft: "",
            QialtyHide2: false,
            QialtyHide: false,
            DeqaIDLeft: false,
            DeqaIDRight: false,
            ErrorFlag: 'Eyes not Found'
        }
        //  this.SaveCaptureEyes = this.onClick.bind(this);
    }

    OnchangeHandle(event) {

        this.setState({
            WindowsApiUrlIrisCapture: "http://localhost:1234/api/Home/IrisCapture?WhichEye=" + event.target.value + `&QualityValue=${this.props.QualityValue}`
        }, () => {
            // alert(this.state.WindowsApiUrlIrisCapture);
        })

    }

    ClosePopupErrorList() {
        this.setState({
            DivMessgaBox: false
        })
    }

    componentDidMount() {

        debugger;
      //  document.getElementById("EyeCaptureButton").disabled = this.props.value;

        axios.get(this.state.WindowsApiUrlOpenDevice_Capture)
            .then(response => {

                if (response.data[0] == 'ConnectionSuccssfult') {
                    // alert("تم تشغيل الكاميرا بنجاح");
                } else if (response.data[0] == 'IS_ERROR_ALREADY_OPEN') {
                    // alert("الكاميرا حاليا في وضع التشغيل");
                } else if (response.data[0] == 'IS_ERROR_NONE') {
                    // alert("الكاميرا حاليا في وضع التشغيل");
                }
                else {
                    if (confirm("قد يكون الجهاز غير متوفر او الخدمة متوقفة أو أنه لم يتم تثبيتها . هل تود تحميل تعريف الإصدار الأحدث من الخدمة؟")) {
                        window.open("./WindowsServices/IRISCameraWinSetup.msi", "_base");
                    }

                }
            }

            ).catch(error => {
                if (confirm("قد يكون الجهاز غير متوفر او الخدمة متوقفة أو أنه لم يتم تثبيتها . هل تود تحميل تعريف الإصدار الأحدث من الخدمة؟")) {
                    window.open("./WindowsServices/IRISCameraWinSetup.msi", "_base");
                }
            }
            )

    }
    CaptureEyes() {
        debugger;
        this.setState({
            ShowpageloaddivLeft: true,
            ShowpageloaddivRight: true,
            DivMessgaBox: false,
            ImageIRIS_Right: "./img/Service$ImageIntegration$Iris2Widget.jpg",
            ImageIRIS_Left: "./img/Service$ImageIntegration$Iris2Widget.jpg",
            QuiltyRight: "",
            QuiltyLeft: "",
            QialtyHide: false,
            QialtyHide2: false,
        })
        axios.get(this.state.WindowsApiUrlIrisCapture)
            .then(response => {
                this.setState({
                    ShowpageloaddivLeft: false,
                    ShowpageloaddivRight: false,
                    ImageIRIS_Left: "",
                    ImageIRIS_Right: "",
                    ResponseMessageQuailityEyes: "",
                    DivMessgaBox: false,
                    QuiltyRight: "",
                    QuiltyLeft: "",
                    QialtyHide: false,
                    QialtyHide2: false
                })



                if (response.data.length > 0) {

                    if (response.data == this.state.ErrorFlag) {
                        this.setState({
                            ResponseMessageQuailityEyes: "كلا العينتين مفقوده",
                            ShowpageloaddivLeft: false,
                            ShowpageloaddivRight: false,
                            DeqaIDLeft: false,
                            DeqaIDRight: false,
                            DivMessgaBox: true,
                            ImageIRIS_Right: "./img/Service$ImageIntegration$BlocksEysPrint.jpg",
                            ImageIRIS_Left: "./img/Service$ImageIntegration$BlocksEysPrint.jpg",
                            QuiltyRight: "العين اليمين مفقودة",
                            QuiltyLeft: "العين اليسار  مفقودة",
                            QialtyHide: true,
                            QialtyHide2: true,
                        })

                    } else {

                        if (response.data[0].ImageQuailtyLeft != '0' && response.data[0].ImageQuailtyRight != '0') {
                           debugger;
                            if (response.data[0].MessageQuailty == 'Success,High quality') {

                                this.setState({
                                    ImageIRIS_Right: "data:image/png;base64," + response.data[0].ImageRight,
                                    ImageIRIS_Left: "data:image/png;base64," + response.data[0].ImageLeft,
                                    QialtyHide: true,
                                    QialtyHide2: true,
                                    DivMessgaBox: true,
                                    ResponseMessageQuailityEyes: this.props.signaturewebQuailitySuccess.value,


                                }, () => {
                                    this.props.ImageRightvalue.setValue(response.data[0].ImageRight);
                                    this.props.ImageLeftvalue.setValue(response.data[0].ImageLeft);
                                })
                                if (response.data[0].ImageQuailtyRight == "110") {
                                    this.setState({
                                        DeqaIDRight: false,
                                        QuiltyRight: "العين اليمنى مفقوده",
                                        ImageIRIS_Right: "./img/Service$ImageIntegration$BlocksEysPrint.jpg",
                                    })
                                } else {
                                    this.setState({
                                        DeqaIDRight: true,
                                        QuiltyRight: response.data[0].ImageQuailtyRight,
                                        ImageIRIS_Right: "data:image/png;base64," + response.data[0].ImageRight
                                    })

                                }

                                if (response.data[0].ImageQuailtyLeft == "110") {
                                    this.setState({
                                        DeqaIDLeft: false,
                                        QuiltyLeft: "العين اليسرى مفقوده",
                                        ImageIRIS_Left: "./img/Service$ImageIntegration$BlocksEysPrint.jpg",

                                    })
                                } else {
                                    this.setState({
                                        DeqaIDLeft: true,
                                        QuiltyLeft: response.data[0].ImageQuailtyLeft,
                                        ImageIRIS_Left: "data:image/png;base64," + response.data[0].ImageLeft

                                    })

                                }

                            } else {
                                this.setState({
                                    ImageIRIS_Right: "data:image/png;base64" + response.data[0].ImageRight,
                                    ImageIRIS_Left: "data:image/png;base64" + response.data[0].ImageLeft,
                                    QialtyHide: true,
                                    QialtyHide2: true,
                                    DivMessgaBox: true,
                                    ResponseMessageQuailityEyes: this.props.signaturewebQuailityFailed.value
                                })

                                if (response.data[0].ImageQuailtyRight == "110") {
                                    this.setState({
                                        DeqaIDRight: false,
                                        QuiltyRight: "العين اليمنى مفقوده",
                                        ImageIRIS_Right: "./img/Service$ImageIntegration$BlocksEysPrint.jpg",
                                    })


                                } else {
                                    this.setState({
                                        DeqaIDRight: true,
                                        QuiltyRight: response.data[0].ImageQuailtyRight,
                                        ImageIRIS_Right: "data:image/png;base64," + response.data[0].ImageRight
                                    })

                                }

                                if (response.data[0].ImageQuailtyLeft == "110") {
                                    this.setState({
                                        DeqaIDLeft: false,
                                        QuiltyLeft: "العين اليسرى مفقوده",
                                        ImageIRIS_Left: "./img/Service$ImageIntegration$BlocksEysPrint.jpg",
                                    })

                                } else {
                                    this.setState({
                                        DeqaIDLeft: true,
                                        QuiltyLeft: response.data[0].ImageQuailtyLeft,
                                        ImageIRIS_Left: "data:image/png;base64," + response.data[0].ImageLeft
                                    })
                                }

                            }

                        } else {
                            this.setState({
                                DivMessgaBox: true,
                                ShowpageloaddivRight: false,
                                ShowpageloaddivLeft: false,
                                ImageIRIS_Right: "./img/Service$ImageIntegration$Iris2Widget.jpg",
                                ImageIRIS_Left: "./img/Service$ImageIntegration$Iris2Widget.jpg",
                                QuiltyRight: "",
                                QuiltyLeft: "",
                                QialtyHide: false,
                                QialtyHide2: false,
                                ResponseMessageQuailityEyes: this.props.signaturewebTimeout.value
                            })

                        }

                    }




                }
                console.log(response.data)
            }

            ).catch(error => {
                if (confirm("قد يكون الجهاز غير متوفر او الخدمة متوقفة أو أنه لم يتم تثبيتها . هل تود تحميل تعريف الإصدار الأحدث من الخدمة؟")) {
                    window.open("./WindowsServices/IRISCameraWinSetup.msi", "_base");
                }
            }
            )
    }


    render() {
        return (
            <div className="container">
           
                <div class="row">
                    <div class="col-xs-12 col-sm-12 col-md-12 header">
                        <img src="./img/Service$ImageIntegration$IraqLogo.png" />
                    </div>
                </div>

                <div class="row">
                    <div class="col-xs-12 col-sm-12 col-md-12">
                        <select id="sDevices" className="form-control" onChange={(event) => this.OnchangeHandle(event)} >
                            <option value="1">العــين اليســرى</option>
                            <option value="0">العـــين اليمــنى</option>
                            <option value="2" selected>كلـــتا العينــين</option>
                            <option value="3" >عيــون مفقـوده</option>
                        </select>
                    </div>
                </div>

                <div class="row rowIrisEys">
                    <div class="col-xs-1 col-sm-1 col-md-1">

                    </div>
                    <div class="col-xs-4 col-sm-4 col-md-4">
                        <div className="img_camera">
                            {this.state.ShowpageloaddivLeft ? (<div id="pageloaddivLeft">
                            </div>) : ('')}

                        </div>
                        <div id="rcorners">العـــين اليمــنى</div>
                        {/* <img id="IMAGE_IRIS_LEFT" alt="" className="borderSstyle" width="280" height="240" style={{ border: "1px soild #000000", borderRadius: "0px 0px 25px 25px", marginTop: "-1px" }} /> */}
                        <img src={this.state.ImageIRIS_Right} id="IMAGE_IRIS_LEFT" alt="" className="borderSstyle" width="280" height="240" style={{ border: "1px soild #000000", borderRadius: "0px 0px 25px 25px", marginTop: "-1px" }} />
                        
                        <div className="row IrisQuilty ">
                        <div class="col-xs-12 col-sm-12 col-md-12">
                        {this.state.QialtyHide ? (
                            <div id="QialtyHide">
                                {this.state.DeqaIDRight ? (
                                    <h4 id="DeqaIDRight" style={{ fontWeight: 'bold' }} >الدقــــة &nbsp;&nbsp; </h4>
                                ) : ('')}

                                <h4 id="QuiltyRight" style={{ fontWeight: 'bold', color: 'brown', fontSize: "20px" }} > {this.state.QuiltyRight}</h4>

                            </div>) : ('')}
                    </div>
                        </div>
                        
                    </div>
                    <div class="col-xs-4 col-sm-4 col-md-4">
                        <div className="img_camera">
                            {this.state.ShowpageloaddivRight ? (<div id="pageloaddivRight">
                            </div>) : ('')}

                        </div>
                        <div id="rcorners">العـــين اليســرى</div>
                        {/* <img id="IMAGE_IRIS_RIGHT" runat="server" className="borderSstyle" width="280" height="240"
                                        style={{ border: "1px soild #000000", borderRadius: "0px 0px 25px 25px", marginTop: "-1px" }} /> */}
                        <img src={this.state.ImageIRIS_Left} id="IMAGE_IRIS_RIGHT" alt="" className="borderSstyle" width="280" height="240" style={{ border: "1px soild #000000", borderRadius: "0px 0px 25px 25px", marginTop: "-1px" }} />
                        <div className="row IrisQuilty">
                        <div class="col-xs-12 col-sm-12 col-md-12">
                        {this.state.QialtyHide2 ? (

                            <div id="QialtyHide2"  >
                                {this.state.DeqaIDLeft ? (
                                    <h4 id="DeqaIDLeft" style={{ fontWeight: 'bold' }}>الدقــــة &nbsp; &nbsp; </h4>
                                ) : ('')}

                                <h4 id="QuiltyLeft"
                                    style={{ fontWeight: 'bold', color: 'brown', fontSize: "20px" }}>{this.state.QuiltyLeft} </h4>


                            </div>
                        ) : ('')}
                    </div>
                        </div>
                    </div>
                    <div class="col-xs-3 col-sm-3 col-md-3">
                        <button type="button" id="EyeCaptureButton" disabled={this.props.EnableButtonCapture.value == 'true' ? true :false} onClick={() => this.CaptureEyes()} className="btn btn-success btn-block">التقاط بصمه العين <h3 className="SaveCapture"> <AiFillCamera style={{color:'#9e8615'}} /> </h3></button>

                        <button type="button" id="SaveEyeButton" disabled={this.props.EnableButtonSave.value == 'true' ? true :false}  onClick={() => this.SaveCaptureEyes()} className="btn btn-success btn-block ">حفظ بصمات العين <h3 className="SaveCapture"> <AiFillSave style={{color:'#9e8615'}} /> </h3></button>

                        <button type="button" id="EyeVeryfiyButton" disabled={this.props.EnableButtonVerify.value == 'true' ? true :false}   className="btn btn-success btn-block ">التحقق من بصمه العين <h3 className="CheckIris"> <AiOutlineCheckCircle style={{color:'#9e8615'}} /> </h3> </button>

                    </div>
                </div>
                 

                <div class="row">
                    <div class="col-xs-12 col-sm-12 col-md-12">
                        {this.state.DivMessgaBox ? (
                            <div id="DivMessgaBox" style={{ margin: "30px" }} >
                                <div className="ContainerClas alert">
                                    <span className="closebtn" onClick={() => this.ClosePopupErrorList()} >&times;</span>
                                    <p style={{ fontSize: "25px", color: 'white' }} id="ResponseMessageQuailityEyes">{this.state.ResponseMessageQuailityEyes}</p>
                                </div>

                            </div>
                        ) : ('')}
                    </div>
                </div>
 
            </div>
        );
    }

    SaveCaptureEyes() {
        debugger;
        if (this.props.onClickAction && this.props.onClickAction.canExecute) {

            this.props.onClickAction.execute();
        }
    }
}
