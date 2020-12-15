using System;
using System.IO;
using System.Web;
using System.Web.Mvc;
using System.Web.Services;

namespace AudiosWhatsapp
{
    public partial class Files : System.Web.UI.Page
    {

        [HttpPost]
        public string UploadFile(HttpPostedFileBase blob)
        {
            blob.SaveAs(@"G:\AudiosWhatsApp\" + blob.FileName);
            return "[SERVER SIDE] File Name is: " + blob.FileName;
        }


        //[WebMethod]
        //public static string UploadFile(HttpPostedFileBase blob)
        //{
        //    try
        //    {
        //        string filename = "AudioDeMierda";
        //        blob.SaveAs(@"G:\AudiosWhatsApp\" + filename + ".wav");

        //        //byte[] blob = { 0, 100, 120, 210, 255 };
        //        //MemoryStream memoryStream = new MemoryStream(blob;
        //        //FileStream fileStream = new FileStream(@"G:\AudiosWhatsApp\" + filename + ".wav", FileMode.Create);
        //        //memoryStream.WriteTo(fileStream);

        //        //memoryStream.Close();
        //        //fileStream.Close();
        //        //fileStream.Dispose();

        //        return "[SERVER SIDE] File Name is: " + filename;
        //    }
        //    catch (Exception ex)
        //    {
        //        return "[SERVER SIDE] ERROR: " + ex.Message.ToString();
        //    }
        //}
    }

    public class SoundBlob
    {
        public string key { get; set; }
        public HttpPostedFileBase blob { get; set; } // I tried byte[] and string too
    }
}