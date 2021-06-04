Login = {
    web3Provider: null,
    contracts: {},

    initWeb3: function () {
        if (typeof web3 !== 'undefined') {
            Login.web3Provider = web3.currentProvider;
        } else {
            Login.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
        }
        web3 = new Web3(Login.web3Provider);
        Login.initContract();
    },

    initContract: function () {

        $.getJSON('Voting.json', function (data) {
            var Artifact = data;

            Login.contracts.Voting = TruffleContract(Artifact);

            Login.contracts.Voting.setProvider(Login.web3Provider);
            //console.log(Login.contracts.Voting);
            //Login.setCounts();
        });
         Login.doGenerate();
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

          Login.contracts.Voting.deployed().then(function (instance) {
                Instance = instance;
                Instance.doGenerate(prvkey1, {from: account});
                //$("#prvkey1").html(prvkey1);
                $("#pubkey1").html(pubkey1);
              });
      });
      //$("#pubkey1").html(keypair.ecpubhex);
      Login.bindEvents();
    },

    bindEvents: function () {
        $(document).on('click', '.btn', Login.handleRegister);
    },

    handleRegister: function() {
      var f1 = document.form1;
      var VotingInstance;
      //console.log(registerId);
      // 获取用户账号
      web3.eth.getAccounts(function (error, accounts) {
          if (error) {
              console.log(error);
          }

          var account = accounts[0];
          //console.log(accounts);

          Login.contracts.Voting.deployed().then(function (instance) {
              VotingInstance = instance;

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

                if(data == "0x0"){
                  alert("注册码错误");
                  Login.bindEvents();
                }

                var registerId = data;

                VotingInstance.VaildID.call({from:account}).then((result) => {
                console.log("Success! Got result: " + result);
                if(result){
                  alert("用户已注册成功");
                  window.location.href = "vote.html";
                }
                else{
                  VotingInstance.someoneRegister(registerId, {from: account});
                  VotingInstance.VaildID.call({from:account}).then((result) => {
                    console.log("Success! Got result: " + result);
                    if(result){
                      alert("注册成功！");
                      window.location.href = "vote.html";
                    }
                    else {
                      //alert("注册码错误");
                      Login.bindEvents();
                    }
                  }).catch((err) => {
                    console.log("Failed with error: " + err);
                  });
                }
      });
    });
    });
  });
}
};

$(function () {
    $(window).load(function () {
        Login.initWeb3();
    });
});
