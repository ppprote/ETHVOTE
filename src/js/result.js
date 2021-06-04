Result = {
    web3Provider: null,
    contracts: {},

    initWeb3: function () {
        if (typeof web3 !== 'undefined') {
            Result.web3Provider = web3.currentProvider;
        } else {
            Result.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
        }
        web3 = new Web3(Result.web3Provider);
        Result.initContract();
    },

    initContract: function () {

        $.getJSON('Voting.json', function (data) {
            var Artifact = data;

            Result.contracts.Voting = TruffleContract(Artifact);

            Result.contracts.Voting.setProvider(Result.web3Provider);
            //console.log(Result.contracts.Voting);
            //Result.setCounts();
        });
         Result.isTimeToResult();
    },

    isTimeToResult: function() {
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

          Result.contracts.Voting.deployed().then(function (instance) {
            Instance = instance;
            //get VoteEndTime
            Instance.getVoteEndTime.call({from:account}).then((result) => {
            console.log("Success! Got result: " + result);
            VoteEndTime = new Date(result.replace(/-/g,"\/"));
            //alert(VoteEndTime);

            //alert(RegisterStartTime);
            //根据时间进行页面的跳转
            if(account == 0x751198822AE54Be2c01C1Ac2F054427B15Cc2A84){
              Result.handleRegister();
            }
            else{
              if(timeDate > VoteEndTime){
                Result.handleRegister();
              }
              else{
                alert("投票还未截止！");
                window.location.href="index.html";
              }
            }
            }).catch((err) => {
            console.log("Failed with error: " + err);
            });

        });
      });
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
          //console.log(accounts);

          Result.contracts.Voting.deployed().then(function (instance) {
              Instance = instance;
              Instance.getProjectName.call({from:account}).then((result) => {
                console.log("Success! Got result: " + result);
                var projectName = result;
                //alert(projectName);
                $("#projectName").html(projectName);
                }).catch((err) => {
                  console.log("Failed with error: " + err);
                });
                //var projectName = Instance.getProjectName().then(value => console.log(value));

                //get select1
                Instance.getCandidateList.call(0,{from:account}).then((result) => {
                  console.log("Success! Got result: " + result);
                  var select1 = result;
                  //alert(select1);
                  $("#select1").html(select1);

                  //get count1
                  Instance.totalVotesFor.call(select1,{from:account}).then((result) => {
                    console.log("Success! Got result: " + result);
                    var count1 = result+" ";
                    //alert(count1);
                    $("#count1").html(count1);
                    //alert(count1);
                  }).catch((err) => {
                    console.log("Failed with error: " + err);
                  });

                }).catch((err) => {
                  console.log("Failed with error: " + err);
                });

                //get select2
                Instance.getCandidateList.call(1,{from:account}).then((result) => {
                  console.log("Success! Got result: " + result);
                  var select2 = result;
                  //alert(select1);
                  $("#select2").html(select2);

                  //get count2
                  Instance.totalVotesFor.call(select2,{from:account}).then((result) => {
                    console.log("Success! Got result: " + result);
                    var count2 = result+" ";
                    //alert(select1);
                    $("#count2").html(count2);
                  }).catch((err) => {
                    console.log("Failed with error: " + err);
                  });
                }).catch((err) => {
                  console.log("Failed with error: " + err);
                });

                Instance.getCandidateList.call(2,{from:account}).then((result) => {
                  console.log("Success! Got result: " + result);
                  var select3 = result;
                  //alert(select1);
                  $("#select3").html(select3);

                  Instance.totalVotesFor.call(select3,{from:account}).then((result) => {
                    console.log("Success! Got result: " + result);
                    var count3 = result+" ";
                    //alert(select1);
                    $("#count3").html(count3);
                  }).catch((err) => {
                    console.log("Failed with error: " + err);
                  });
                }).catch((err) => {
                  console.log("Failed with error: " + err);
                });


                //var select1 = Instance.getCandidateList(0);
                //alert(select1);
                //var select2 = Instance.getCandidateList(1);
                //var select3 = Instance.getCandidateList(2);
                //window.location.href="result.html";
              });
      });
    }
  };

$(function () {
    $(window).load(function () {
        Result.initWeb3();
    });
});
