Index = {
    web3Provider: null,
    contracts: {},

    initWeb3: function () {
        if (typeof web3 !== 'undefined') {
            Index.web3Provider = web3.currentProvider;
        } else {
            Index.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
        }
        web3 = new Web3(Index.web3Provider);
        Index.initContract();
    },

    initContract: function () {

        $.getJSON('Voting.json', function (data) {
            var Artifact = data;

            Index.contracts.Voting = TruffleContract(Artifact);

            Index.contracts.Voting.setProvider(Index.web3Provider);
            //console.log(Index.contracts.Voting);
            //Index.setCounts();
        });
         Index.bindEvents();
    },

    bindEvents: function () {
        $(document).on('click', '.btn-block', Index.handleSignin);
    },

    handleSignin: function() {
      var VotingInstance;
      var user_id = $("#user_id").val();
      //console.log(user_id.toLowerCase());
      var frontAccount = user_id.toLowerCase();
      var RegisterStartTime;
      var VoteEndTime;
      var date = new Date();
      var month = date.getMonth() + 1;
      var time = date.getFullYear() +"-"+ month +"-"+ date.getDate()+" "+date.getHours()+":"+date.getMinutes();
      var timeDate = new Date(time.replace(/-/g,"\/"));
      console.log("Success! Got result: " + time);
      //alert(timeDate);
      //console.log(registerId);
      // 获取用户账号
      web3.eth.getAccounts(function (error, accounts) {
        if (error) {
          console.log(error);
        }

        var account = accounts[0];
        console.log(account);
        //alter(account);
        Index.contracts.Voting.deployed().then(function (instance) {
          VotingInstance = instance;

          //get RegisterStartTime
          VotingInstance.getRegisterStartTime.call({from:account}).then((result) => {
            console.log("Success! Got result: " + result);
            RegisterStartTime = new Date(result.replace(/-/g,"\/"));
            //alert(RegisterStartTime);

            //get VoteEndTime
            VotingInstance.getVoteEndTime.call({from:account}).then((result) => {
              console.log("Success! Got result: " + result);
              VoteEndTime = new Date(result.replace(/-/g,"\/"));
              //alert(VoteEndTime);

              //根据时间进行页面的跳转
              if(user_id == "0x751198822AE54Be2c01C1Ac2F054427B15Cc2A84"){//该账号设置为管理员账号
                if(account == 0x751198822AE54Be2c01C1Ac2F054427B15Cc2A84){
                  if(timeDate > RegisterStartTime  && timeDate  < VoteEndTime){
                    window.location.href="note.html";
                  }
                  else if (timeDate> VoteEndTime ) {
                    window.location.href="result.html";
                  }
                  else{
                    window.location.href="project.html";
                  }
                }
                else {
                  alert("请同时用管理员账户登录Metamask");
                }
              }
              else{
                if(frontAccount == account){
                  if(timeDate < RegisterStartTime ){
                    alert("投票系统还未开放");
                    window.location.href="index.html";
                  }
                  else if(timeDate > VoteEndTime ){
                    alert("投票已截止");
                    window.location.href="result.html";
                  }
                  else{
                    VotingInstance.VaildID.call({from:account}).then((vaildornot) => {
                      console.log("Success! Got Vote: " + vaildornot);
                      if(!vaildornot){
                        alert("请先注册！");
                        window.location.href="login.html";
                      }
                      else{
                        window.location.href="vote.html";
                      }
                    }).catch((err) => {
                      console.log("Failed with error: " + err);
                    });
                  }
                }
                else{
                  alert("请同时用该账户登录Metamask");
                }
              }
              }).catch((err) => {
              console.log("Failed with error: " + err);
              });

            //$("#projectName").html("投票项目: " + projectName);
            }).catch((err) => {
              console.log("Failed with error: " + err);
            });

        });
      });
    }
};

$(function () {
    $(window).load(function () {
        Index.initWeb3();
    });
});
