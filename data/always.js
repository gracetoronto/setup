function equipAlways(channels, equipment) {
   equipment.snake = 1; // if using snake
   equipment.xlr++; equipment.xlrLong++; // for Main L/R
   equipment.wedge = 2; equipment.xlr += 2; equipment.powerCable += 2; // for wedges
   channels += 2; // for Macbook

   return [ channels, equipment ];
}