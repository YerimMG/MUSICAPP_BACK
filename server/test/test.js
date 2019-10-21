let chai = require('chai');
let chaiHttp = require('chai-http');
const expect = require('chai').expect;


chai.use(chaiHttp);
let token = 'BQCbZvuDW-SxM8oJ08vyFXA6sW3udq-VHWoCvhWoHIWpM3CEC3JQ80kxH8pSb419BpLoyQtYMZJRSxLisQ5Ygl_VvdscVtrMHhJaoDIbnvO4BWl2PJjl54vhePSR8D71yv1_4EtVnsZnJtildJuqyn8y7EoTBk825DEmLGO6nNpODI45rNcYtjQa674'
const url= `https://shielded-crag-67706.herokuapp.com/`;



describe('get user tracks',()=>{
  it('should get all user tracks', (done) => {
    chai.request(url)
      .get(`info/${token}/tracks`)
      .end( function(err,res){
        expect(res).to.have.status(200);
        done();
      });
  });
});



describe('get user artists', () => {
  it('should get all user artist', (done) => {
    chai.request(url)
    .get(`info/${token}/Artists`)
    .end( (err, res) => {
      expect(res).to.have.status(200);
      done();
    })
  })
})


describe('get user info', () => {
  it('should get user info', (done) => {
    chai.request(url)
    .get(`info/${token}`)
    .end( (err, res) => {
      expect(res).to.have.status(200);
      done();
    })
  })
})