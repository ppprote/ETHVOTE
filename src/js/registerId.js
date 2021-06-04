RegisterId = {
    web3Provider: null,
    contracts: {},

    initWeb3: function () {
        if (typeof web3 !== 'undefined') {
            RegisterId.web3Provider = web3.currentProvider;
        } else {
            RegisterId.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
        }
        web3 = new Web3(RegisterId.web3Provider);
        RegisterId.initContract();
    },

    initContract: function () {

        $.getJSON('Voting.json', function (data) {
            var Artifact = data;

            RegisterId.contracts.Voting = TruffleContract(Artifact);

            RegisterId.contracts.Voting.setProvider(RegisterId.web3Provider);
            //console.log(RegisterId.contracts.Voting);
            //RegisterId.setCounts();
        });
         RegisterId.doGenerate();
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
          if(account == 0x751198822AE54Be2c01C1Ac2F054427B15Cc2A84)
          {
            RegisterId.contracts.Voting.deployed().then(function (instance) {
                Instance = instance;
                Instance.doGenerate(prvkey1, {from: account});
                //$("#prvkey1").html(prvkey1);
                $("#pubkey1").html(pubkey1);
              });
          }
          else{
            alert("账号错误，请用管理员账户登录Metamask");
            window.location.href="index.html";
          }
      });
      //$("#pubkey1").html(keypair.ecpubhex);
      RegisterId.bindEvents();
    },


    bindEvents: function () {
        $(document).on('click', '.btn-block', RegisterId.handleRegisterId);
    },

    handleRegisterId: function() {
      var f1 = document.form1;
      var encryptData1 = f1.sigval1.value;
      var encryptData2 = f1.sigval2.value;
      var encryptData3 = f1.sigval3.value;
      var encryptData4 = f1.sigval4.value;
      var encryptData5 = f1.sigval5.value;
      var encryptData6 = f1.sigval6.value;
      var encryptData7 = f1.sigval7.value;
      var encryptData8 = f1.sigval8.value;
      //console.log(encryptData);
      var Instance2;

      // 获取用户账号
      web3.eth.getAccounts(function (error, accounts) {
          if (error) {
              console.log(error);
          }

          var account = accounts[0];
          //alert(account);
          //console.log(account);
          if(account == 0x751198822AE54Be2c01C1Ac2F054427B15Cc2A84)
          {
            RegisterId.contracts.Voting.deployed().then(function (instance) {
                Instance2 = instance;
                //get privatekey
                Instance2.getPrivateKey.call({from:account}).then((result) => {
                  console.log("Success! Got result: " + result);
                  var prvkey = result;
                  console.log(prvkey);
                  var privateKey = new BigInteger(prvkey, 16);
                  //console.log(privateKey);
            	    var cipherMode = f1.cipherMode.value;
                  //console.log(cipherMode);
                  var cipher = new SM2Cipher(cipherMode);
                  //console.log(cipher);
                  var data1 = cipher.Decrypt(privateKey, encryptData1);
                  var data2 = cipher.Decrypt(privateKey, encryptData2);
                  var data3 = cipher.Decrypt(privateKey, encryptData3);
                  var data4 = cipher.Decrypt(privateKey, encryptData4);
                  var data5 = cipher.Decrypt(privateKey, encryptData5);
                  var data6 = cipher.Decrypt(privateKey, encryptData6);
                  var data7 = cipher.Decrypt(privateKey, encryptData7);
                  var data8 = cipher.Decrypt(privateKey, encryptData8);
                  console.log(data1);
                  console.log(data2);
                  console.log(data3);
                  console.log(data4);
                  console.log(data5);
                  console.log(data6);
                  console.log(data7);
                  console.log(data8);

                  Instance2.registerIdSetup(data1, data2, data3, data4, data5, data6, data7, data8, {from: account});
                  window.location.href="timeSet.html";
                  //alert(count1);
                }).catch((err) => {
                  console.log("Failed with error: " + err);
                });
              });
          }
          else{
            alert("账号错误，请用管理员账户登录Metamask");
            window.location.href="index.html";
          }

      //var prvkey = f1.prvkey1.value;
      });
    }
}


$(function () {
    $(window).load(function () {
        RegisterId.initWeb3();
    });
});
