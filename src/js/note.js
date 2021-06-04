Note = {
    web3Provider: null,
    contracts: {},

    initWeb3: function () {
        if (typeof web3 !== 'undefined') {
            Note.web3Provider = web3.currentProvider;
        } else {
            Note.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
        }
        web3 = new Web3(Note.web3Provider);
        Note.initContract();
    },

    initContract: function () {

        $.getJSON('Voting.json', function (data) {
            var Artifact = data;

            Note.contracts.Voting = TruffleContract(Artifact);

            Note.contracts.Voting.setProvider(Note.web3Provider);
            //console.log(Note.contracts.Voting);
            //Note.setCounts();
        });
         Note.handleRegister();
    },

    handleRegister: function() {
      var VotingInstance;
      var RegisterStartTime;
      var RegisterEndTime;
      var VoteStartTime;
      var VoteEndTime;
      // 获取用户账号

      //var registerId = $("#registerId").val();
      //console.log(registerId);
      // 获取用户账号
      web3.eth.getAccounts(function (error, accounts) {
          if (error) {
              console.log(error);
          }

          var account = accounts[0];
          //console.log(accounts);

          Note.contracts.Voting.deployed().then(function (instance) {
          //get RegisterStartTime
          VotingInstance = instance;

          VotingInstance.getRegisterStartTime.call({from:account}).then((result) => {
            console.log("Success! Got result: " + result);
            RegisterStartTime = result+" ";
            //alert(RegisterStartTime);
            //$("#RegisterStartTime").html("注册时间: " + RegisterStartTime);
            //RegisterStartTime = new Date(result.replace(/-/g,"\/"));
            //alert(RegisterStartTime);

            //get RegisterEndTime
            VotingInstance.getRegisterEndTime.call({from:account}).then((result) => {
              console.log("Success! Got result: " + result);
              RegisterEndTime = result+" ";
              //alert(RegisterEndTime);
                //get VoteStartTime
                VotingInstance.getVoteStartTime.call({from:account}).then((result) => {
                console.log("Success! Got result: " + result);
                VoteStartTime = result+" ";
                //alert(VoteStartTime);
                    //get VoteEndTime
                    VotingInstance.getVoteEndTime.call({from:account}).then((result) => {
                    console.log("Success! Got result: " + result);
                    VoteEndTime = result+" ";
                    //alert(VoteEndTime);

                    $("#RegisterTime").html("注册时间: " + RegisterStartTime + "- " + RegisterEndTime);
                    $("#VoteTime").html("投票时间: " + VoteStartTime + "- " + VoteEndTime);

                    }).catch((err) => {
                      console.log("Failed with error: " + err);
                    });

                }).catch((err) => {
                console.log("Failed with error: " + err);
                });

              }).catch((err) => {
              console.log("Failed with error: " + err);
              });

            //$("#projectName").html("投票项目: " + projectName);
            }).catch((err) => {
              console.log("Failed with error: " + err);
            });

            //get registerCount
            VotingInstance.getRegisterCount.call({from:account}).then((result) => {
              console.log("register count: " + result);
              var registerCount = result+" ";
              $("#RegisterCount").html(registerCount + "位投票者通过注册");
            }).catch((err) => {
              console.log("Failed with error: " + err);
            });

            //get voteCount
            VotingInstance.getVoteCount.call({from:account}).then((result) => {
              console.log("vote count: " + result);
              var voteCount = result+" ";
              $("#VoteCount").html(voteCount + "位投票者已投票");
            }).catch((err) => {
              console.log("Failed with error: " + err);
            });

        });
      });

      Note.bindEvents();
    },

    bindEvents: function () {
        $(document).on('click', '.btn-block', Note.handleNote);
    },

    handleNote: function () {
      var Instance;
      var VoteEndTime;
      var date = new Date();
      var time = date.getFullYear() +"-"+ date.getMonth() +"-"+ date.getDate()+" "+date.getHours()+":"+date.getMinutes();
      var timeDate = new Date(time.replace(/-/g,"\/"));
      //alert(timeDate);
      //console.log(registerId);
      // 获取用户账号
      web3.eth.getAccounts(function (error, accounts) {
          if (error) {
              console.log(error);
          }

          var account = accounts[0];
          //console.log(accounts);

          Note.contracts.Voting.deployed().then(function (instance) {
            Instance = instance;
            //get VoteEndTime
            Instance.getVoteEndTime.call({from:account}).then((result) => {
            console.log("Success! Got result: " + result);
            VoteEndTime = new Date(result.replace(/-/g,"\/"));
            //alert(VoteEndTime);

            //alert(RegisterStartTime);
            //根据时间进行页面的跳转
            if(account == 0x751198822AE54Be2c01C1Ac2F054427B15Cc2A84){
              if(timeDate > VoteEndTime){
                window.location.href="result.html";
              }
              else{
                alert("投票还未截止！");
                window.location.href="note.html";
                Note.initWeb3();
              }
            }
            else{
              alert("账号错误");
              window.location.href="index.html";
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
        Note.initWeb3();
    });
});
