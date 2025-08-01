function equipAlways(channels, equipment) {

   // Sean or Josh – could you add the equipment we need every time with the following syntax:
   // equipment = addItem(equipment, "Item Name", quantity);

   // to add one: equipment = addItem(equipment, "Item Name", 1);
   // to add three: equipment = addItem(equipment, "Item Name", 1);
   // item names should correspond to inventory.js

   // MULTIPURPOSE

   equipment = addItem(equipment, "CGF Cable Bin", 2);

   // POWER

   equipment = addItem(equipment, "Power Bar", 2);
   equipment = addItem(equipment, "Extension Cord", 1);

   // PROJECTION

   equipment = addItem(equipment, "Projector", 1);
   // equipment = addItem(equipment, "HDMI Cable", 1);
   equipment = addItem(equipment, "HDMI Cable (Long)", 1);
   equipment = addItem(equipment, "HDMI Extension", 1);
   equipment = addItem(equipment, "USB-C Hub", 1);

   // LIGHTING

   // equipment = addItem(equipment, "Side Flood Lights", 4);
   // equipment = addItem(equipment, "Stage PAR", 4);
   // equipment = addItem(equipment, "Stage Wash", 4);
   // equipment = addItem(equipment, "DMX Transmitter", 1);
   // equipment = addItem(equipment, "DMX Receiver", 6);
   // equipment = addItem(equipment, "USB to DMX Adapter", 1);
   // equipment = addItem(equipment, "USB-C Adapter", 1);
   // equipment = addItem(equipment, "Light Stand", 2);
   equipment = addItem(equipment, "PAR Light Rig", 2);
   equipment = addItem(equipment, "PAR Light Stand", 2);
   equipment = addItem(equipment, "Bar Light", 2);
   equipment = addItem(equipment, "DMX Cable", 4);

   // SOUND

   equipment = addItem(equipment, "L-12 Mixer", 1);
   equipment = addItem(equipment, "L-12 Mixer Power Cable", 1);

   // if using snake
   equipment = addItem(equipment, "Audio Snake", 1);

   // for Main L/R
   equipment = addItem(equipment, "XLR Cable", 1);
   equipment = addItem(equipment, "XLR Cable (50ft)", 1);

   // for wedges
   const usingWedges = document.querySelector('input[name="use_wedges[]"]').checked;
   if (usingWedges) {
      equipment = addItem(equipment, "XLR-M to 1/4 TRS-M Adapter", 2);
      equipment = addItem(equipment, "Wedge (Active)", 2);
      equipment = addItem(equipment, "XLR Cable", 2);
      equipment = addItem(equipment, "IEC Power Cable", 2);
   }

   // for wireless mics
   const usingWireless = document.querySelector('input[name="use_wireless_mics[]"]').checked;
   if (usingWireless) {
      equipment = addItem(equipment, "Sound Cart", 1);
      equipment = addItem(equipment, "XLR Cable", 2);
   }

   // for Macbook
   const macbookStereo = document.querySelector('input[name="macbook_stereo[]"]').checked;
   if (macbookStereo) {

      const chans = [{ label: "Macbook L" }, { label: "Macbook R" }];
      [equipment, chans[0]] = addItem(equipment, "USB-B to USB-A Adapter", 1, chans[0]);

      channels.push(...chans);

   } else {

      const chans = [{ label: "Macbook" }];
      [equipment, chans[0]] = addItem(equipment, "1/4 TRS to 3.5mm TRS Adapter", 1, chans[0]);

      channels.push(...chans);
   }

   // for wireless IEMs
   // const wirelessIEMChannels = parseInt(document.querySelector('select[name="wireless_iem_channels[]"]').value);
   const usingWirelessIEMs = wirelessIEMChannels > 0;
   if (usingWirelessIEMs) {
      equipment = addItem(equipment, "IEM Transmitter", 1);
      equipment = addItem(equipment, "IEM Transmitter Power Supply", 1);
      equipment = addItem(equipment, "IEM Transmitter Antenna", 2);
      equipment = addItem(equipment, "1/4 TS Cable (Short)", wirelessIEMChannels);
   }

   // for wired IEMs
   // const wiredIEMChannels = parseInt(document.querySelector('select[name="wired_iem_channels[]"]').value);
   const usingWiredIEMs = wiredIEMChannels > 0;
   if (usingWiredIEMs) {
      equipment = addItem(equipment, "1/4 TS Cable (Short)", wiredIEMChannels);
      equipment = addItem(equipment, "DI Box (Passive)", wiredIEMChannels);
      equipment = addItem(equipment, "XLR Cable", wiredIEMChannels);
   }

   return [ channels, equipment ];
}