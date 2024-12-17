const roles = [
   {
      name: "vocal",
      label: "Vocal",
      constraints: {
         singing: { checked: true, disabled: true },
         bringing: { checked: false, disabled: true },
         stereo: { checked: false, disabled: true }
      },
      equip: ({position}, channels, equipment) => {

         // always
         equipment["Mic (Wired)"]++;
         equipment["Music Stand"]++;
         channels++;

         // depending on distance from stage box, xlr or xlrLong
         const xlrLength = position === "far" ? "XLR (Long)" : "XLR";
         equipment[xlrLength]++;

         return [ channels, equipment ];
      }
   },
   {
      name: "acoustic_guitar",
      label: "Acoustic Guitar",
      constraints: {
         singing: { checked: false, disabled: false },
         bringing: { checked: false, disabled: false },
         stereo: { checked: false, disabled: true }
      },
      equip: ({singing, bringing, position}, channels, equipment) => {

         // always need
         equipment["TS Cable"]++;
         equipment["DI Box"]++;
         equipment["Music Stand"]++;
         channels++;

         // depending on distance
         const xlrLength = position === "far" ? "XLR (Long)" : "XLR";
         equipment[xlrLength]++;

         if (singing) {
            equipment[xlrLength]++;
            equipment["Mic (Wired)"]++;
            equipment["Boom Stand"]++;
            channels++;
         }

         equipment["Acoustic Guitar"] = bringing ? equipment["Acoustic Guitar"] : 1;

         return [ channels, equipment ];
      }
   },
   {
      name: "piano",
      label: "Piano",
      constraints: {
         singing: { checked: false, disabled: false },
         bringing: { checked: false, disabled: true },
         stereo: { checked: false, disabled: false }
      },
      equip: ({singing, position}, channels, equipment) => {

         if (singing) {

            // always
            equipment["Mic (Wired)"]++;
            equipment["Boom Stand"]++;
            channels++;

            // depending on distance
            const xlrLength = position === "far" ? "XLR (Long)" : "XLR";
            equipment[xlrLength]++;
         }

         return [ channels, equipment ];
      }
   },
   {
      name: "keyboard",
      label: "Keyboard",
      constraints: {
         singing: { checked: false, disabled: false },
         bringing: { checked: false, disabled: false },
         stereo: { checked: false, disabled: false }
      },
      equip ({singing, bringing, stereo, position}, channels, equipment) {

         // always
         equipment["Music Stand"]++;

         // depending on distance
         const xlrLength = position === "far" ? "XLR (Long)" : "XLR";
         equipment[xlrLength] = stereo ? equipment[xlrLength] + 2 : equipment[xlrLength] + 1;


         // if stereo, need double the equipment
         if (stereo) {
            equipment["TS Cable"] += 2;
            equipment["DI Box (Dual)"]++;
            channels += 2;

         // if mono
         } else {
            equipment["TS Cable"]++;
            equipment["DI Box"]++;
            channels++;
         }

         if (singing) {
            equipment[xlrLength]++;
            equipment["Mic (Wired)"]++;
            equipment["Boom Stand"]++;
            channels++;
         }

         // bringing keyboard
         equipment["Keyboard"] = bringing ? equipment["Keyboard"] : equipment["Keyboard"]++;

         return [ channels, equipment ];
      }
   },
   {
      name: "electric_guitar",
      label: "Electric Guitar",
      constraints: {
         singing: { checked: false, disabled: false },
         bringing: { checked: true, disabled: true },
         stereo: { checked: false, disabled: false }
      },
      equip: ({singing, stereo, position}, channels, equipment) => {
         
         // always
         equipment["Music Stand"]++;

         // depending on distance
         const xlrLength = position === "far" ? "XLR (Long)" : "XLR";
         equipment[xlrLength] = stereo ? equipment[xlrLength] + 2 : equipment[xlrLength] + 1;

         // if stereo, need double
         if (stereo) {
            equipment["TS Cable"] += 2;
            equipment["DI Box (Dual)"]++;
            channels += 2;
         } else {
            equipment["TS Cable"]++;
            equipment["DI Box"]++;
            channels++;
         }

         if (singing) {
            equipment[xlrLength]++;
            equipment["Mic (Wired)"]++;
            equipment["Boom Stand"]++;
            channels++;
         }

         return [ channels, equipment ];
      }
   },
   {
      name: "bass",
      label: "Bass",
      constraints: {
         singing: { checked: false, disabled: false },
         bringing: { checked: false, disabled: false },
         stereo: { checked: false, disabled: true }
      },
      equip: ({singing, bringing, position}, channels, equipment) => {
         
         // always
         equipment.musicStand++;
         equipment.tsCable++;
         equipment.diBox++;
         channels++;

         // depending on distance
         const xlrLength = position === "far" ? "XLR (Long)" : "XLR";
         equipment[xlrLength]++;

         if (singing) {
            equipment[xlrLength]++;
            equipment["Mic (Wired)"]++;
            equipment["Boom Stand"]++;
            channels++;
         }

         equipment.bass = bringing ? equipment.bass : 1;

         return [ channels, equipment ];
      }
   },
   {
      name: "violin",
      label: "Violin",
      constraints: {
         singing: { checked: false, disabled: true },
         bringing: { checked: true, disabled: true },
         stereo: { checked: false, disabled: true }
      },
      equip: ({position}, channels, equipment) => {

         // always
         equipment["Music Stand"]++;
         equipment["Boom Stand"]++;
         channels++;

         // depending on distance
         const xlrLength = position === "far" ? "XLR (Long)" : "XLR";
         equipment[xlrLength]++;

         return [ channels, equipment ];
      }
   },
   {
      name: "cajon",
      label: "Cajon",
      constraints: {
         singing: { checked: false, disabled: false },
         bringing: { checked: false, disabled: true },
         stereo: { checked: false, disabled: true }
      },
      equip: ({singing, bringing, position}, channels, equipment) => {
         
         // always
         equipment["Music Stand"]++;
         equipment["Boom Stand (Short)"]++;
         equipment["Mic (Instrument)"]++;
         channels++;
         
         // depending on distance
         const xlrLength = position === "far" ? "XLR (Long)" : "XLR";
         equipment[xlrLength]++;

         if (singing) {
            equipment[xlrLength]++;
            equipment["Boom Stand"]++;
            equipment["Mic (Wired)"]++;
            channels++;
         }

         if (!bringing) {
            equipment["Cajon"] = 1;
         }

         return [ channels, equipment ];
      }
   },
   {
      name: "speaker",
      label: "Speaker",
      constraints: {
         singing: { checked: true, disabled: true },
         bringing: { checked: false, disabled: true },
         stereo: { checked: false, disabled: true }
      },
      equip: ({position}, channels, equipment) => {

         // always
         equipment["Mic (Wired)"]++;
         equipment["Music Stand"]++;
         channels++;

         // depending on distance
         const xlrLength = position === "far" ? "XLR (Long)" : "XLR";
         equipment[xlrLength]++;

         return [ channels, equipment ];
      }
   }
]