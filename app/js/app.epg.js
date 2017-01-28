/*

   Copyright 2017   Jan Kammerath

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.

*/

app.epg = {
   ready: false,

	init: function(){
      /* keep checking until epg ready */
      app.epg.waitUntilReady();
   },

   waitUntilReady: function(){
      /* check the status of the epg */
      app.epg.ready = app.epg.checkStatus();
      if(!app.epg.ready){
         /* check again until it is ready */
         setTimeout(app.epg.waitUntilReady,500);
      }
   },

   /* gets the current channel and its current show */
   getCurrentChannelShow: function(){
      var result = new Object();
      var now = Date.now() / 1000;

      if(typeof(iptvx)=="object"){
         /* iterate through all channels */
         for(var c=0;c<iptvx.epg.length;c++){
            /* ensure c is the active channel number */
            if(c == iptvx.channel){
               result.channelId = c;
               result.channelName = iptvx.epg[c].name;
               result.programme = null;

               /* determine the current programme */
               for(var p=0;p<iptvx.epg[c].programmeList.length;p++){
                  var programme = iptvx.epg[c].programmeList[p];
                  if(programme.start <= now && programme.stop >= now){
                     /* this is the current show */
                     result.programme = programme;
                  }
               }
            }  
         }
      }

      return result;
   },

   checkStatus: function(){
      var result = false;

      if(typeof(iptvx)=="object"){
         if(iptvx.epgLoaded == 100){
            /* epg is finished */
            result = true;
            $("#status").hide();

            /* tell the control to listen */
            app.control.listen();

            /* show the control */
            app.control.toggle();
         }else{
            if(iptvx.epgLoaded > 0){
               $("#status").html(iptvx.epgLoaded);
            }
            $("#status").show();
         }
      }

      return result;
   }
}