using AudioRecorder.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Internal;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace AudioRecorder.Controllers
{
    public class FileController : Controller
    {
        [HttpPost]
        public ActionResult AjaxUploadAudio(Audio audio)
        {
            //audio.blob.SaveAs(@"G:\AudiosWhatsApp\" + audio.filename + audio.extension);
            return Json(new { success = true, message = "Audio " + audio.filename + audio.extension + " updated successfully." }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public ActionResult UploadAudio(Audio audio)
        {
            //audio.blob.SaveAs(@"G:\AudiosWhatsApp\" + audio.filename + audio.extension);
            return Content("Audio " + audio.filename + audio.extension + " updated successfully.", "text/plain");
        }

        [HttpPost]
        public ActionResult UploadAudioBlob()
        {
            if(Request.Files.Count == 1)
            {
                HttpPostedFileBase file = Request.Files[0]; 
                string fileName = file.FileName;
                file.SaveAs(@"G:\AudiosWhatsApp\" + fileName);
                return Content("Audio " + file.FileName + " updated successfully.", "text/plain");
            }
            else
            {
                return Content("Error al recibir el audio.", "text/plain");
            }
        }

        // GET: File
        public ActionResult Index()
        {
            return View();
        }

        // GET: File/Details/5
        public ActionResult Details(int id)
        {
            return View();
        }

        // GET: File/Create
        public ActionResult Create()
        {
            return View();
        }

        // POST: File/Create
        [HttpPost]
        public ActionResult Create(System.Web.Mvc.FormCollection collection)
        {
            try
            {
                // TODO: Add insert logic here

                return RedirectToAction("Index");
            }
            catch
            {
                return View();
            }
        }

        // GET: File/Edit/5
        public ActionResult Edit(int id)
        {
            return View();
        }

        // POST: File/Edit/5
        [HttpPost]
        public ActionResult Edit(int id, System.Web.Mvc.FormCollection collection)
        {
            try
            {
                // TODO: Add update logic here

                return RedirectToAction("Index");
            }
            catch
            {
                return View();
            }
        }

        // GET: File/Delete/5
        public ActionResult Delete(int id)
        {
            return View();
        }

        // POST: File/Delete/5
        [HttpPost]
        public ActionResult Delete(int id, System.Web.Mvc.FormCollection collection)
        {
            try
            {
                // TODO: Add delete logic here

                return RedirectToAction("Index");
            }
            catch
            {
                return View();
            }
        }
    }
}
