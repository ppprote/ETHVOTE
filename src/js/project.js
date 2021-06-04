Project = {
    web3Provider: null,
    contracts: {},

    initWeb3: function () {
      if (typeof web3 !== 'undefined') {
          Project.web3Provider = web3.currentProvider;
      } else {
          Project.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
      }
      web3 = new Web3(Project.web3Provider);
      Project.initContract();
    },

    initContract: function () {

        $.getJSON('Voting.json', function (data) {
            var Artifact = data;

            Project.contracts.Voting = TruffleContract(Artifact);

            Project.contracts.Voting.setProvider(Project.web3Provider);
            //console.log(Index.contracts.Voting);
            //Index.setCounts();
        });
         Project.bindEvents();
    },

    bindEvents: function () {
        $(document).on('click', '.btn-block', Project.handleProject);
    },

    handleProject: function() {
      var VotingInstance;
      var project_name = $("#project_name").val();
      //alert(project_name);
      var select1_name = $("#select1_name").val();
      var select2_name = $("#select2_name").val();
      var select3_name = $("#select3_name").val();


      //console.log(registerId);
      // 获取用户账号
      web3.eth.getAccounts(function (error, accounts) {
          if (error) {
              console.log(error);
          }

          var account = accounts[0];
          //alert(account);
          //console.log(accounts);
          if(account == 0x751198822AE54Be2c01C1Ac2F054427B15Cc2A84)
          {
            Project.contracts.Voting.deployed().then(function (instance) {
                VotingInstance = instance;
                VotingInstance.projectSetup(project_name, select1_name, select2_name, select3_name, {from: account});
                window.location.href="registerId.html";
              });
          }
          else{
            alert("账号错误，请用管理员账户登录Metamask");
            window.location.href="index.html";
          }
      });
    }
}


$(function () {
    $(window).load(function () {
        Project.initWeb3();
    });
});
