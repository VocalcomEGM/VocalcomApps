using System.Web;

namespace AudioRecorder.Models
{
    public class Audio
    {
        public string filename { get; set; }
        public string extension { get; set; }
    }

    public class AudioFile
    {
        public HttpPostedFileBase blob { get; set; }
        public string filename { get; set; }
        public string extension { get; set; }
    }
}