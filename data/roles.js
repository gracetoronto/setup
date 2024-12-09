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
         equipment.micWired++;
         equipment.musicStand++;
         channels++;

         // depending on distance from stage box, xlr or xlrLong
         const xlrLength = position === "far" ? "xlrLong" : "xlr";
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
         equipment.tsCable++;
         equipment.diBox++;
         equipment.musicStand++;
         channels++;

         // depending on distance
         const xlrLength = position === "far" ? "xlrLong" : "xlr";
         equipment[xlrLength]++;

         if (singing) {
            equipment[xlrLength]++;
            equipment.micWired++;
            equipment.boomStand++;
            channels++;
         }

         equipment.acousticGuitar = bringing ? equipment.acousticGuitar : 1;

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
            equipment.micWired++;
            equipment.boomStand++;
            channels++;

            // depending on distance
            const xlrLength = position === "far" ? "xlrLong" : "xlr";
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
         equipment.musicStand++;

         // depending on distance
         const xlrLength = position === "far" ? "xlrLong" : "xlr";
         equipment[xlrLength] = stereo ? equipment[xlrLength] + 2 : equipment[xlrLength] + 1;


         // if stereo, need double the equipment
         if (stereo) {
            equipment.tsCable += 2;
            equipment.diBoxDual++;
            channels += 2;

         // if mono
         } else {
            equipment.tsCable++;
            equipment.diBox++;
            channels++;
         }

         if (singing) {
            equipment[xlrLength]++;
            equipment.micWired++;
            equipment.boomStand++;
            channels++;
         }

         // bringing keyboard
         equipment.keyboard = bringing ? equipment.keyboard : equipment.keyboard++;

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
         equipment.musicStand++;

         // depending on distance
         const xlrLength = position === "far" ? "xlrLong" : "xlr";
         equipment[xlrLength] = stereo ? equipment[xlrLength] + 2 : equipment[xlrLength] + 1;

         // if stereo, need double
         if (stereo) {
            equipment.tsCable += 2;
            equipment.diBoxDual++;
            channels += 2;
         } else {
            equipment.tsCable++;
            equipment.diBox++;
            channels++;
         }

         if (singing) {
            equipment[xlrLength]++;
            equipment.micWired++;
            equipment.boomStand++;
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
         const xlrLength = position === "far" ? "xlrLong" : "xlr";
         equipment[xlrLength]++;

         if (singing) {
            equipment[xlrLength]++;
            equipment.micWired++;
            equipment.boomStand++;
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
         equipment.musicStand++;
         equipment.boomStand++;
         channels++;

         // depending on distance
         const xlrLength = position === "far" ? "xlrLong" : "xlr";
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
         equipment.musicStand++;
         equipment.boomStandShort++;
         equipment.micInstrument++;
         channels++;
         
         // depending on distance
         const xlrLength = position === "far" ? "xlrLong" : "xlr";
         equipment[xlrLength]++;

         if (singing) {
            equipment[xlrLength]++;
            equipment.boomStand++;
            equipment.micWired++;
            channels++;
         }

         if (!bringing) {
            equipment.cajon = 1;
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
         equipment.micWired++;
         equipment.musicStand++;
         channels++;

         // depending on distance
         const xlrLength = position === "far" ? "xlrLong" : "xlr";
         equipment[xlrLength]++;

         return [ channels, equipment ];
      }
   }
]