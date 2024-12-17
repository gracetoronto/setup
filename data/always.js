function equipAlways(channels, equipment) {
   equipment["Snake"] = 1; // if using snake
   equipment["XLR"]++; equipment["XLR (Long)"]++; // for Main L/R
   equipment["Wedge"] = 2; equipment["XLR"] += 2; equipment["Power Cable"] += 2; // for wedges
   channels += 2; // for Macbook

   return [ channels, equipment ];
}