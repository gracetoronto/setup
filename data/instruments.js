function addItem(equipment, item, add, chan) {

   if (equipment[item] === undefined || equipment[item] === null) {
      equipment[item] = 0;
   }
   
   equipment[item] += add;

   if (chan) {

      if (!chan.equipment) {
         chan.equipment = {};
      }

      if (chan.equipment[item] === undefined || chan.equipment[item] === null) {
         chan.equipment[item] = 0;
      }
   
      chan.equipment[item] += add;
   
      return [equipment, chan];
   }

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
      equip: ({position}, channels, equipment, musician) => {

         // always
         const chans = [{ label: "Mic", musician: musician }];
         [equipment, chans[0]] = addItem(equipment, "Mic (Wired)", 1, chans[0]);
         [equipment, chans[0]] = addItem(equipment, "Music Stand", 1, chans[0]);

         // depending on distance from stage box, xlr or xlrLong
         const xlrLength = position === "far" ? "XLR Cable (Long)" : "XLR Cable";
         [equipment, chans[0]] = addItem(equipment, xlrLength, 1, chans[0]);

         channels.push(...chans);

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
      equip: ({singing, bringing, position}, channels, equipment, musician) => {

         // always need
         const chans = [{ label: "Acoustic Guitar", musician: musician }];
         [equipment, chans[0]] = addItem(equipment, "1/4 TS Cable", 1, chans[0]);
         [equipment, chans[0]] = addItem(equipment, "DI Box", 1, chans[0]);
         [equipment, chans[0]] = addItem(equipment, "Music Stand", 1, chans[0]);

         // depending on distance
         const xlrLength = position === "far" ? "XLR Cable (Long)" : "XLR Cable";
         [equipment, chans[0]] = addItem(equipment, xlrLength, 1, chans[0]);

         if (singing) {
            chans.push({ label: "Mic", musician: musician });
            [equipment, chans[1]] = addItem(equipment, xlrLength, 1, chans[1]);
            [equipment, chans[1]] = addItem(equipment, "Mic (Wired)", 1, chans[1]);
            [equipment, chans[1]] = addItem(equipment, "Boom Stand", 1, chans[1]);
         }

         if (!bringing) {
            [equipment, chans[0]] = addItem(equipment, "Acoustic Guitar", 1, chans[0]);
         }

         channels.push(...chans);

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
      equip: ({singing, position}, channels, equipment, musician) => {

         const chans = [];

         if (singing) {

            // always
            chans.push({ label: "Mic", musician: musician });
            [equipment, chans[0]] = addItem(equipment, "Mic (Wired)", 1, chans[0]);
            [equipment, chans[0]] = addItem(equipment, "Boom Stand", 1, chans[0]);

            // depending on distance
            const xlrLength = position === "far" ? "XLR Cable (Long)" : "XLR Cable";
            [equipment, chans[0]] = addItem(equipment, xlrLength, 1, chans[0]);
         }

         channels.push(...chans);

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
      equip ({singing, bringing, stereo, position}, channels, equipment, musician) {

         const chans = [];

         // depending on distance
         const xlrLength = position === "far" ? "XLR Cable (Long)" : "XLR Cable";

         // if stereo, need double the equipment
         if (stereo) {

            chans.push({ label: `Keyboard L`, musician: musician }, { label: `Keyboard R`, musician: musician });

            [equipment, chans[0]] = addItem(equipment, xlrLength, 1, chans[0]);
            [equipment, chans[1]] = addItem(equipment, xlrLength, 1, chans[1]);

            [equipment, chans[0]] = addItem(equipment, "1/4 TS Cable", 1, chans[0]);
            [equipment, chans[1]] = addItem(equipment, "1/4 TS Cable", 1, chans[1]);

            [equipment, chans[0]] = addItem(equipment, "DI Box (Stereo)", 1, chans[0]);

         // if mono
         } else {
            
            chans.push({ label: `Keyboard`, musician: musician });

            [equipment, chans[0]] = addItem(equipment, xlrLength, 1, chans[0]);
            [equipment, chans[0]] = addItem(equipment, "1/4 TS Cable", 1, chans[0]);
            [equipment, chans[0]] = addItem(equipment, "DI Box", 1, chans[0]);
         }

         if (singing) {

            const i = chans.length;

            chans.push({ label: `Mic`, musician: musician });

            [equipment, chans[i]] = addItem(equipment, xlrLength, 1, chans[i]);
            [equipment, chans[i]] = addItem(equipment, "Mic (Wired)", 1, chans[i]);
            [equipment, chans[i]] = addItem(equipment, "Boom Stand", 1, chans[i]);
         }

         if (!bringing) {
            [equipment, chans[0]] = addItem(equipment, "Keyboard", 1, chans[0]);
            [equipment, chans[0]] = addItem(equipment, "Keyboard Stand", 1, chans[0]);
         }

         // always
         [equipment, chans[0]] = addItem(equipment, "Music Stand", 1, chans[0]);

         channels.push(...chans);

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
      equip: ({singing, stereo, position}, channels, equipment, musician) => {
         
         // always
         const chans = [];

         // depending on distance
         const xlrLength = position === "far" ? "XLR Cable (Long)" : "XLR Cable";

         // if stereo, need double
         if (stereo) {

            chans.push({ label: `Electric Guitar L`, musician: musician }, { label: `Electric Guitar R`, musician: musician });

            [equipment, chans[0]] = addItem(equipment, xlrLength, 1, chans[0]);
            [equipment, chans[1]] = addItem(equipment, xlrLength, 1, chans[1]);

            [equipment, chans[0]] = addItem(equipment, "1/4 TS Cable", 1, chans[0]);
            [equipment, chans[1]] = addItem(equipment, "1/4 TS Cable", 1, chans[1]);

            [equipment, chans[0]] = addItem(equipment, "DI Box (Stereo)", 1, chans[0]);

         } else {

            chans.push({ label: `Electric Guitar`, musician: musician });

            [equipment, chans[0]] = addItem(equipment, xlrLength, 1, chans[0]);

            [equipment, chans[0]] = addItem(equipment, "1/4 TS Cable", 1, chans[0]);
            [equipment, chans[0]] = addItem(equipment, "DI Box", 1, chans[0]);
         }

         if (singing) {

            const i = chans.length;

            chans.push({ label: `Mic`, musician: musician });

            [equipment, chans[i]] = addItem(equipment, xlrLength, 1, chans[i]);
            [equipment, chans[i]] = addItem(equipment, "Mic (Wired)", 1, chans[i]);
            [equipment, chans[i]] = addItem(equipment, "Boom Stand", 1, chans[i]);
         }

         // always
         [equipment, chans[0]] = addItem(equipment, "Music Stand", 1, chans[0]);

         channels.push(...chans);

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
      equip: ({singing, bringing, position}, channels, equipment, musician) => {
         
         // always
         const chans = [{ label: `Bass`, musician: musician }];
         [equipment, chans[0]] = addItem(equipment, "Music Stand", 1, chans[0]);
         [equipment, chans[0]] = addItem(equipment, "1/4 TS Cable", 1, chans[0]);
         [equipment, chans[0]] = addItem(equipment, "DI Box", 1, chans[0]);

         // depending on distance
         const xlrLength = position === "far" ? "XLR Cable (Long)" : "XLR Cable";
         [equipment, chans[0]] = addItem(equipment, xlrLength, 1, chans[0]);

         if (singing) {
            chans.push({ label: `Mic`, musician: musician });
            [equipment, chans[1]] = addItem(equipment, xlrLength, 1, chans[1]);
            [equipment, chans[1]] = addItem(equipment, "Mic (Wired)", 1, chans[1]);
            [equipment, chans[1]] = addItem(equipment, "Boom Stand", 1, chans[1]);
         }

         if (!bringing) {
            [equipment, chans[0]] = addItem(equipment, "Bass", 1, chans[0]);
         }

         channels.push(...chans);

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
      equip: ({position}, channels, equipment, musician) => {

         // always
         const chans = [{ label: "Violin", musician: musician }];

         [equipment, chans[0]] = addItem(equipment, "Music Stand", 1, chans[0]);
         [equipment, chans[0]] = addItem(equipment, "Boom Stand", 1, chans[0]);

         // depending on distance
         const xlrLength = position === "far" ? "XLR Cable (Long)" : "XLR Cable";
         [equipment, chans[0]] = addItem(equipment, xlrLength, 1, chans[0]);

         channels.push(...chans);

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
      equip: ({singing, bringing, position}, channels, equipment, musician) => {
         
         // always
         const chans = [{ label: `Cajon`, musician: musician }];
         [equipment, chans[0]] = addItem(equipment, "Music Stand", 1, chans[0]);
         [equipment, chans[0]] = addItem(equipment, "Boom Stand (Short)", 1, chans[0]);
         [equipment, chans[0]] = addItem(equipment, "Mic (Instrument)", 1, chans[0]);
         
         // depending on distance
         const xlrLength = position === "far" ? "XLR Cable (Long)" : "XLR Cable";
         [equipment, chans[0]] = addItem(equipment, xlrLength, 1, chans[0]);

         if (singing) {
            chans.push({ label: `Mic`, musician: musician });
            [equipment, chans[1]] = addItem(equipment, xlrLength, 1, chans[1]);
            [equipment, chans[1]] = addItem(equipment, "Boom Stand", 1, chans[1]);
            [equipment, chans[1]] = addItem(equipment, "Mic (Wired)", 1), chans[1];
         }

         if (!bringing) {
            [equipment, chans[0]] = addItem(equipment, "Cajon", 1, chans[0]);
         }

         channels.push(...chans);

         return [ channels, equipment ];
      }
   }
]