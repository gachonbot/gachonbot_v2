function test (req, res) {
  // const res1 = req.body.res1;
  return res.status(200).json({success: true, response: 'hi'})
}

function posttest (req, res) {
  const res1 = req.body.res1;
  return res.status(200).json({success:true, response: res1});
}

module.exports = {
    test: test,
    posttest: posttest,
}
