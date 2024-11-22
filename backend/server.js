const express = require("express");
const multer = require("multer")
const docxToPDF = require("docx-pdf")
const path = require("path")
const app = express();


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
      
      cb(null, file.originalname)
    }
  })
  
const upload = multer({ storage: storage })


///////////////////////////

app.post("/convertFile",upload.single("file"),(req,res,next)=>{
    try{

        if(!req.file){
            return res.status(400).json({
                message:"Please upload a file"
            })
        }

        //defining output file path
        let outputPath = path.join(__dirname,"files",`${req.file.originalname}.pdf`)
        docxToPDF(req.file.path,outputPath,(err,result)=>{
            if(err){                                                               
                console.log(err);
                return res.status(500).json({
                    message:"Error Converting docx to pdf"
                })
            }
            res.download(outputPath,()=>{
                console.log("file downloaded");
            })
        })
    }                                                   
    catch(error){
        console.log(error);
        res.status(500).json({
            message: "Internal server error"
        })
    }
})



app.listen(3000,()=>{
    console.log("app listening on port 3k");
});