function addItem(equipment, item, add) {
   if (equipment[item] === undefined || equipment[item] === null) {
      equipment[item] = 0;
   }

   equipment[item] += add;

   return equipment;
}

const instruments = [
   {
      name: "none",
      label: "None",
      constraints: {
         singing: { checked: true, disabled: true },
         bringing: { checked: false, disabled: true },
         stereo: { checked: false, disabled: true }
      },
      equip: ({position}, channels, equipment) => {

         // always
         equipment = addItem(equipment, "Mic (Wired)", 1);
         equipment = addItem(equipment, "Music Stand", 1);
         channels++;

         // depending on distance from stage box, xlr or xlrLong
         const xlrLength = position === "far" ? "XLR Cable (Long)" : "XLR Cable";
         equipment = addItem(equipment, xlrLength, 1);

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
         equipment = addItem(equipment, "1/4 TS Cable", 1);
         equipment = addItem(equipment, "DI Box", 1);
         equipment = addItem(equipment, "Music Stand", 1);
         channels++;

         // depending on distance
         const xlrLength = position === "far" ? "XLR Cable (Long)" : "XLR Cable";
         equipment = addItem(equipment, xlrLength, 1);

         if (singing) {
            equipment = addItem(equipment, xlrLength, 1);
            equipment = addItem(equipment, "Mic (Wired)", 1);
            equipment = addItem(equipment, "Boom Stand", 1);
            channels++;
         }

         if (!bringing) {
            equipment = addItem(equipment, "Acoustic Guitar", 1);
         }

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
            equipment = addItem(equipment, "Mic (Wired)", 1);
            equipment = addItem(equipment, "Boom Stand", 1);
            channels++;

            // depending on distance
            const xlrLength = position === "far" ? "XLR Cable (Long)" : "XLR Cable";
            equipment = addItem(equipment, xlrLength, 1);
         }

         return [ channels, equipment ];
      }
   },
   {
      name: "keyboard",
      label: "Keyboard",
      constraints: {
         singing: { checked: false, disabled: false },
         bringing: { checked: false, disabled: true },
         stereo: { checked: false, disabled: false }
      },
      equip ({singing, bringing, stereo, position}, channels, equipment) {

         // always
         equipment = addItem(equipment, "Music Stand", 1);

         // depending on distance
         const xlrLength = position === "far" ? "XLR Cable (Long)" : "XLR Cable";
         equipment = addItem(equipment, xlrLength, stereo ? 2 : 1);
         


         // if stereo, need double the equipment
         if (stereo) {
            equipment = addItem(equipment, "1/4 TS Cable", 2);
            equipment = addItem(equipment, "DI Box (Stereo)", 1);
            channels += 2;

         // if mono
         } else {
            equipment = addItem(equipment, "1/4 TS Cable", 1);
            equipment = addItem(equipment, "DI Box", 1);
            channels++;
         }

         if (singing) {
            equipment = addItem(equipment, xlrLength, 1);
            equipment = addItem(equipment, "Mic (Wired)", 1);
            equipment = addItem(equipment, "Boom Stand", 1);
            channels++;
         }

         if (!bringing) {
            equipment = addItem(equipment, "Keyboard", 1);
            equipment = addItem(equipment, "Keyboard Stand", 1);
         }

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
         equipment = addItem(equipment, "Music Stand", 1);

         // depending on distance
         const xlrLength = position === "far" ? "XLR Cable (Long)" : "XLR Cable";
         equipment = addItem(equipment, xlrLength, stereo ? 2 : 1);

         // if stereo, need double
         if (stereo) {
            equipment = addItem(equipment, "1/4 TS Cable", 2);
            equipment = addItem(equipment, "DI Box (Stereo)", 1);
            channels += 2;
         } else {
            equipment = addItem(equipment, "1/4 TS Cable", 1);
            equipment = addItem(equipment, "DI Box", 1);
            channels++;
         }

         if (singing) {
            equipment = addItem(equipment, xlrLength, 1);
            equipment = addItem(equipment, "Mic (Wired)", 1);
            equipment = addItem(equipment, "Boom Stand", 1);
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
         equipment = addItem(equipment, "Music Stand", 1);
         equipment = addItem(equipment, "1/4 TS Cable", 1);
         equipment = addItem(equipment, "DI Box", 1);
         channels++;

         // depending on distance
         const xlrLength = position === "far" ? "XLR Cable (Long)" : "XLR Cable";
         equipment = addItem(equipment, xlrLength, 1);

         if (singing) {
            equipment = addItem(equipment, xlrLength, 1);
            equipment = addItem(equipment, "Mic (Wired)", 1);
            equipment = addItem(equipment, "Boom Stand", 1);
            channels++;
         }

         if (!bringing) {
            equipment = addItem(equipment, "Bass", 1);
         }

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
         equipment = addItem(equipment, "Music Stand", 1);
         equipment = addItem(equipment, "Boom Stand", 1);
         channels++;

         // depending on distance
         const xlrLength = position === "far" ? "XLR Cable (Long)" : "XLR Cable";
         equipment = addItem(equipment, xlrLength, 1);

         return [ channels, equipment ];
      }
   },
   {
      name: "cajon",
      label: "Cajon",
      constraints: {
         singing: { checked: false, disabled: false },
         bringing: { checked: false, disabled: false },
         stereo: { checked: false, disabled: true }
      },
      equip: ({singing, bringing, position}, channels, equipment) => {
         
         // always
         equipment = addItem(equipment, "Music Stand", 1);
         equipment = addItem(equipment, "Boom Stand (Short)", 1);
         equipment = addItem(equipment, "Mic (Instrument)", 1);
         channels++;
         
         // depending on distance
         const xlrLength = position === "far" ? "XLR Cable (Long)" : "XLR Cable";
         equipment = addItem(equipment, xlrLength, 1);

         if (singing) {
            equipment = addItem(equipment, xlrLength, 1);
            equipment = addItem(equipment, "Boom Stand", 1);
            equipment = addItem(equipment, "Mic (Wired)", 1);
            channels++;
         }

         if (!bringing) {
            equipment = addItem(equipment, "Cajon", 1);
         }

         return [ channels, equipment ];
      }
   },
   // {
   //    name: "speaker",
   //    label: "Speaker",
   //    constraints: {
   //       singing: { checked: true, disabled: true },
   //       bringing: { checked: false, disabled: true },
   //       stereo: { checked: false, disabled: true }
   //    },
   //    equip: ({position}, channels, equipment) => {

   //       // always
   //       equipment = addItem(equipment, "Mic (Wired)", 1);
   //       equipment = addItem(equipment, "Music Stand", 1);
   //       channels++;

   //       // depending on distance
   //       const xlrLength = position === "far" ? "XLR Cable (Long)" : "XLR Cable";
   //       equipment = addItem(equipment, xlrLength, 1);

   //       return [ channels, equipment ];
   //    }
   // }
]