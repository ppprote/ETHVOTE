Vote = {
    web3Provider: null,
    contracts: {},

    initWeb3: function () {
        if (typeof web3 !== 'undefined') {
            Vote.web3Provider = web3.currentProvider;
        } else {
            Vote.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
        }
        web3 = new Web3(Vote.web3Provider);
        Vote.initContract();
    },

    initContract: function () {

        $.getJSON('Voting.json', function (data) {
            var Artifact = data;

            Vote.contracts.Voting = TruffleContract(Artifact);

            Vote.contracts.Voting.setProvider(Vote.web3Provider);
            //console.log(Vote.contracts.Voting);
            //Vote.setCounts();
        });
         Vote.doGenerate();
    },

    doGenerate: function(){
      var f1 = document.form1;
      var curve = f1.curve1.value;
      var ec = new KJUR.crypto.ECDSA({"curve": curve});
      var keypair = ec.generateKeyPairHex();

      //f1.prvkey1.value = keypair.ecprvhex;
      f1.pubkey1.value = keypair.ecpubhex;
      var prvkey1 = keypair.ecprvhex+" ";
      var pubkey1 = f1.pubkey1.value;
      var Instance;
      // 获取用户账号
      web3.eth.getAccounts(function (error, accounts) {
          if (error) {
              console.log(error);
          }

          var account = accounts[0];
          //alert(account);
          //console.log(account);

          Vote.contracts.Voting.deployed().then(function (instance) {
                Instance = instance;
                Instance.doGenerate(prvkey1, {from: account});
                //$("#prvkey1").html(prvkey1);
                $("#pubkey1").html(pubkey1);
              });
      });
      //$("#pubkey1").html(keypair.ecpubhex);
      Vote.handleRegister();
    },

    handleRegister: function() {
      var Instance;

      //var registerId = $("#registerId").val();
      //console.log(registerId);
      // 获取用户账号
      web3.eth.getAccounts(function (error, accounts) {
          if (error) {
              console.log(error);
          }

          var account = accounts[0];
          //console.log(account);
          //$("#user_id").html(account);
          Vote.contracts.Voting.deployed().then(function (instance) {
              Instance = instance;
              Instance.getProjectName.call({from:account}).then((Vote) => {
                console.log("Success! Got Vote: " + Vote);
                var projectName = Vote;
                //alert(projectName);
                $("#projectName").html(projectName);
                }).catch((err) => {
                  console.log("Failed with error: " + err);
                });
                //var projectName = Instance.getProjectName().then(value => console.log(value));

                //get select1
                Instance.getCandidateList.call(0,{from:account}).then((Vote) => {
                  console.log("Success! Got Vote: " + Vote);
                  var select1 = Vote;
                  //alert(select1);
                  $("#select1").html(select1);

                }).catch((err) => {
                  console.log("Failed with error: " + err);
                });

                //get select2
                Instance.getCandidateList.call(1,{from:account}).then((Vote) => {
                  console.log("Success! Got Vote: " + Vote);
                  var select2 = Vote;
                  //alert(select1);
                  $("#select2").html(select2);
                }).catch((err) => {
                  console.log("Failed with error: " + err);
                });

                Instance.getCandidateList.call(2,{from:account}).then((Vote) => {
                  console.log("Success! Got Vote: " + Vote);
                  var select3 = Vote;
                  //alert(select1);
                  $("#select3").html(select3);
                }).catch((err) => {
                  console.log("Failed with error: " + err);
                });
              });
      });
      Vote.vote();
    },


    vote: function () {
      $(document).on('click', '.btn', Vote.handleVote);
    },

    handleVote: function () {
      var f1 = document.form1;
      var VotingInstance;
      // 获取用户账号
      web3.eth.getAccounts(function (error, accounts) {
          if (error) {
              console.log(error);
          }
          var account = accounts[0];
          //console.log(accounts);
          Vote.contracts.Voting.deployed().then(function (instance) {
              VotingInstance = instance;
              VotingInstance.VaildID.call({from:account}).then((vaildornot) => {
                console.log("Success! Got Vote: " + vaildornot);
                if(!vaildornot){
                  alert("请先注册！");
                  window.location.href="login.html";
                }
                else{
                  VotingInstance.isVoted.call({from:account}).then((votedornot) => {
                    console.log("Success! Got Vote: " + votedornot);
                    if(votedornot){
                      VotingInstance.getVoteData.call({from:account}).then((votedata) => {
                        console.log("Success! Got Vote: " + votedata);
                        alert("您已投过票！您投票的对象是："+votedata);
                        Vote.initWeb3();
                      }).catch((err) => {
                        console.log("Failed with error: " + err);
                      });
                    }
                    else{
                      //get privatekey
                      VotingInstance.getPrivateKey.call({from:account}).then((result) => {
                        console.log("Success! Got result: " + result);
                        var prvkey = result;
                        console.log(prvkey);
                        var privateKey = new BigInteger(prvkey, 16);
                        //var prvkey = f1.prvkey1.value;
                        //console.log(prvkey);
                        var encryptData = f1.sigval1.value;
                        console.log(encryptData);
                        var privateKey = new BigInteger(prvkey, 16);
                        console.log(privateKey);
                  	    var cipherMode = f1.cipherMode.value;
                        console.log(cipherMode);
                        var cipher = new SM2Cipher(cipherMode);
                        console.log(cipher);
                        var data = cipher.Decrypt(privateKey, encryptData);
                        console.log(data);

                        var candidateName = data;
                        VotingInstance.voteDataStore(candidateName, {from: account});
                        VotingInstance.voteForCandidate(candidateName, {from: account});
                        VotingInstance.getVoteEndTime.call({from:account}).then((result) => {
                          console.log("Success! Got result: " + result);
                          //VoteEndTime = new Date(result.replace(/-/g,"\/"));

                          alert("投票成功！结果将会于"+ result +"公布！")

                          }).catch((err) => {
                            console.log("Failed with error: " + err);
                          });
                      });

                    }

                    }).catch((err) => {
                      console.log("Failed with error: " + err);
                    });
                  }
                }).catch((err) => {
                  console.log("Failed with error: " + err);
                });
              });
          });
    }
  };

$(function () {
    $(window).load(function () {
        Vote.initWeb3();
    });
});
