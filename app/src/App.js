import './App.css';
import {
  useState
} from 'react';
import {
  Connection,
  PublicKey
} from '@solana/web3.js';
import {
  Program,
  Provider,
  web3
} from '@project-serum/anchor';
import * as anchor from '@project-serum/anchor';
import idl from './on_chain_twitter_3.json';

import {
  PhantomWalletAdapter
} from '@solana/wallet-adapter-wallets';
import {
  useWallet,
  WalletProvider,
  ConnectionProvider
} from '@solana/wallet-adapter-react';
import {
  WalletModalProvider,
  WalletMultiButton
} from '@solana/wallet-adapter-react-ui';
// import { add, from, toString } from '@pacote/u64';
// import { TweetBody } from './components/tweet.js';
// import {PullToRefresh, PullDownContent, ReleaseContent, RefreshContent} from "react-js-pull-to-refresh";
require('@solana/wallet-adapter-react-ui/styles.css');

const wallets = [
  /* view list of available wallets at https://github.com/solana-labs/wallet-adapter#wallets */
  new PhantomWalletAdapter()
]

const {
  SystemProgram,
  Keypair
} = web3;
/* create an account  */
const baseAccount = Keypair.generate();
const opts = {
  preflightCommitment: "processed"
}
const programID = new PublicKey(idl.metadata.address);

function App() {
  const [value, setValue] = useState(null);
  const wallet = useWallet();

  async function getProvider() {
    /* create the provider and return it to the caller */
    /* network set to local network for now */
    const network = "https://api.devnet.solana.com";
    const connection = new Connection(network, opts.preflightCommitment);

    const provider = new Provider(
      connection, wallet, opts.preflightCommitment,
    );
    return provider;
  }
/*
  async function createCounter() {
    const provider = await getProvider()
    /* create the program interface combining the idl, program ID, and provider */
/*    const program = new Program(idl, programID, provider);
    try {
      /* interact with the program via rpc */
/*      await program.rpc.create({
        accounts: {
          baseAccount: baseAccount.publicKey,
          user: provider.wallet.publicKey,
          systemProgram: SystemProgram.programId,
        },
        signers: [baseAccount]
      });

      const account = await program.account.baseAccount.fetch(baseAccount.publicKey);
      console.log('account: ', account);
      setValue(account.count.toString());
    } catch (err) {
      console.log("Transaction error: ", err);
    }
  }
*/

  async function getTwitterUsers() {
    const provider = await getProvider()
    /* create the program interface combining the idl, program ID, and provider */
    console.log(programID.toBase58());
    const program = new Program(idl, programID, provider);
    this.state.twitterUser = await program.account.twitterUser.all();
    console.log('twitter users accounts: ', twitterUser);
  }

  async function getTweets() {
    const provider = await getProvider()
    /* create the program interface combining the idl, program ID, and provider */
    console.log(programID.toBase58());
    const program = new Program(idl, programID, provider);
    this.state.tweets = await program.account.tweet.all();
    console.log('tweets accounts: ', tweets);
  }

  async function componentWillMount() {
    getTwitterUsers();
    getTweets();
  }

  componentWillMount();

  async function sendTweet() {
    const provider = await getProvider()
    /* create the program interface combining the idl, program ID, and provider */
    console.log(programID.toBase58());
    const program = new Program(idl, programID, provider);
    try {
      const [userPda,userBump] = await PublicKey.findProgramAddress(
        [
          Buffer.from("twitter-user"),
          provider.wallet.publicKey.toBuffer()
        ],
        programID
      );
      const twitterUser = await program.account.twitterUser.fetch(userPda);
      console.log('tweet account: ', twitterUser);
      // console.log(Uint8Array.from(parseInt(twittercount.toString())));
      const new_keypar = web3.Keypair.generate();
      const [pda,bump] = await PublicKey.findProgramAddress(
        [
          anchor.utils.bytes.utf8.encode("tweet-account"),
          provider.wallet.publicKey.toBuffer(),
          new_keypar.publicKey.toBuffer()
        ],
        programID
      );
      const numberOfTweets = await program.rpc.getNumberOfTweetsByUser({
        accounts: {
          author: provider.wallet.publicKey,
          twitterUser: userPda,
        }
      });
      console.log("number of tweets : ", numberOfTweets);
      const updateAddress = await program.rpc.updateNextAddress(new_keypar.publicKey, {
        accounts: {
          author: provider.wallet.publicKey,
          twitterUser: userPda,
        }
      });
      const account = await program.rpc.sendTweet("New Tweet", "New description", {
        accounts: {
          twitterUser: userPda,
          tweet: pda,
          author: provider.wallet.publicKey,
          systemProgram: web3.SystemProgram.programId,
        }
      });
      console.log("signature",account)
      const tweetAccounts1 = await program.account.tweet.fetch(pda);
      // const tweetAccounts = await program.account.tweet.fetch(pda);
      // console.log('tweet account: ', tweetAccounts);
      console.log('tweet account: ', tweetAccounts1);
    } catch (err) {
      console.log("Transaction error: ", err);
    }
  }

  async function updateTweet() {
    const provider = await getProvider()
    /* create the program interface combining the idl, program ID, and provider */
    console.log(programID.toBase58());
    const program = new Program(idl, programID, provider);
    try {
      const [userPda,userBump] = await PublicKey.findProgramAddress(
        [
          Buffer.from("twitter-user"),
          provider.wallet.publicKey.toBuffer()
        ],
        programID
      );
      const twitterUser = await program.account.twitterUser.fetch(userPda);
      console.log('tweet account: ', twitterUser);
      let tweets = await program.account.tweet.all();
      console.log('tweet account: ', tweets);
      // console.log(Uint8Array.from(parseInt(twittercount.toString())));
      const [pda,bump] = await PublicKey.findProgramAddress(
        [
          anchor.utils.bytes.utf8.encode("tweet-account"),
          provider.wallet.publicKey.toBuffer(),
          tweets[0].account.address.toBuffer()
        ],
        programID
      );
      // const [pda,bump] = await PublicKey.findProgramAddress(
      //   [
      //     anchor.utils.bytes.utf8.encode("tweet-account"),
      //     provider.wallet.publicKey.toBuffer(),
      //     tweetAccounts2[0].publicKey.toBuffer()
      //   ],
      //   programID
      // );
      const updateAddress = await program.rpc.updateNextAddress(tweets[0].account.address, {
        accounts: {
          author: provider.wallet.publicKey,
          twitterUser: userPda,
        }
      });
      // const tweets = await program.account.tweet.all();
      // const tweetAccounts = await program.account.tweet.fetch(pda);
      // console.log('tweet account: ', tweets);
      const account = await program.rpc.updateTweet('Edited Tweet。', 'First/Second tweet through bloackchain', {
        accounts: {
          twitterUser: userPda,
          tweet: pda,
          author: provider.wallet.publicKey
        }
      });
      console.log("signature",account)
      const tweetAccounts1 = await program.account.tweet.all();
      // const tweetAccounts = await program.account.tweet.fetch(pda);
      console.log('tweet account: ', tweetAccounts1);
      // console.log('tweet account: ', tweetAccounts);
    } catch (err) {
      console.log("Transaction error: ", err);
    }
  }

  async function deleteTweet() {
    const provider = await getProvider()
    console.log(programID.toBase58());
    const program = new Program(idl, programID, provider);
    try {
      const [userPda,userBump] = await PublicKey.findProgramAddress(
        [
          Buffer.from("twitter-user"),
          provider.wallet.publicKey.toBuffer()
        ],
        programID
      );
      const twitterUser = await program.account.twitterUser.fetch(userPda);
      console.log('tweet account: ', twitterUser);
      let tweets = await program.account.tweet.all();
      console.log('tweet account: ', tweets);
      // console.log(Uint8Array.from(parseInt(twittercount.toString())));
      const [pda,bump] = await PublicKey.findProgramAddress(
        [
          Buffer.from("tweet-account"),
          provider.wallet.publicKey.toBuffer(),
          tweets[0].account.address.toBuffer()
        ],
        programID
      );
      // const [pda,bump] = await PublicKey.findProgramAddress(
      //   [
      //     anchor.utils.bytes.utf8.encode("tweet-account"),
      //     provider.wallet.publicKey.toBuffer(),
      //     tweetAccounts2[0].publicKey.toBuffer()
      //   ],
      //   programID
      // );
      const updateAddress = await program.rpc.updateNextAddress(tweets[0].account.address, {
        accounts: {
          author: provider.wallet.publicKey,
          twitterUser: userPda,
        }
      });
      // const tweets = await program.account.tweet.all();
      // const tweetAccounts = await program.account.tweet.fetch(pda);
      // console.log('tweet account: ', tweets);
      const account = await program.rpc.deleteTweet({
        accounts: {
          twitterUser: userPda,
          tweet: pda,
          author: provider.wallet.publicKey
        }
      });
      console.log("signature",account)
      const tweetAccounts1 = await program.account.tweet.all();
      console.log('tweet account: ', tweetAccounts1);
    } catch (err) {
      console.log("Transaction error: ", err);
    }
  }

  async function createAccount() {
    const provider = await getProvider()
    console.log(programID.toBase58());
    const program = new Program(idl, programID, provider);
    try {
      const [pda,bump] = await PublicKey.findProgramAddress(
        [
          anchor.utils.bytes.utf8.encode("twitter-user"),
          provider.wallet.publicKey.toBuffer()
        ],
        programID
      );
      const account = await program.rpc.createTwitterAccount("vamsi",{
        accounts: {
          author: provider.wallet.publicKey,
          twitterUser: pda,
          systemProgram: web3.SystemProgram.programId,
        }
      });
      const tweetAccounts1 = await program.account.twitterUser.fetch(pda);
      console.log('tweet account: ', tweetAccounts1);
    } catch (err) {
      console.log("Transaction error: ", err);
    }
  }

  async function updateAccount() {
    const provider = await getProvider()
    console.log(provider.wallet.publicKey.toBase58());
    const program = new Program(idl, programID, provider);
    try {
      const opts = {
        preflightCommitment: "processed"
      }
      const network = "https://api.devnet.solana.com";
      const connection = new Connection(network, opts.preflightCommitment);
      // const accounts = await connection.getProgramAccounts(programID);
      // let tweetClient = program.account.twitterUser;
      // const testing = await program.account.twitterUser._idlAccount.name;
      // let obj = {
      //   memcmp: tweetClient.coder.accounts.memcmp(testing)
      // }
      // const allTweetUserss = await connection.getProgramAccounts(programID, {
      //   filters: [obj],
      //   dataSlice: { offset: 40, length: 8 },
      // })
      // console.log('tweet account: ', allTweetUserss);
      // const twitteruser = await program.account.twitterUser.all();
      // console.log('twitter users: ', twitteruser);
      console.log(provider.wallet.publicKey.toBase58())
      const [pda,bump] = await PublicKey.findProgramAddress(
        [
          Buffer.from("twitter-user"),
          provider.wallet.publicKey.toBuffer()
        ],
        programID
      );
      const account = await program.rpc.changeUserName("mcnole",{
        accounts: {
          author: provider.wallet.publicKey,
          twitterUser: pda
        }
      });
      const tweetAccounts2 = await program.account.twitterUser.fetch(pda);
      console.log('tweet account: ', tweetAccounts2);
    } catch (err) {
      console.log("Transaction error: ", err);
    }
  }

  async function deleteAccount() {
    const provider = await getProvider()
    console.log(programID.toBase58());
    const program = new Program(idl, programID, provider);
    try {
      const [pda,bump] = await PublicKey.findProgramAddress(
        [
          anchor.utils.bytes.utf8.encode("twitter-user"),
          provider.wallet.publicKey.toBuffer()
        ],
        programID
      );
      // const tweetAccounts1 = await program.account.twitterUser.all();
      // console.log('tweet account: ', tweetAccounts1);
      const account = await program.rpc.deleteTwitterAccount({
        accounts: {
          twitterUser: pda,
          author: provider.wallet.publicKey
        }
      });
      console.log("signature",account)
      // const tweetAccounts1 = await program.account.twitterUser.all();
      const tweetAccounts = await program.account.tweet.fetch(pda);
      console.log('tweet account: ', tweetAccounts);
    } catch (err) {
      console.log("Transaction error: ", err);
    }
  }

  async function increment() {
    const provider = await getProvider();
    const program = new Program(idl, programID, provider);
    await program.rpc.increment({
      accounts: {
        baseAccount: baseAccount.publicKey
      }
    });

    const account = await program.account.baseAccount.fetch(baseAccount.publicKey);
    console.log('account: ', account);
    setValue(account.count.toString());
  }

  if (!wallet.connected) {
    /* If the user's wallet is not connected, display connect wallet button. */
    return ( 
      <div style = {
        {
          display: 'flex',
          justifyContent: 'center',
          marginTop: '100px'
        }
      } >
      <WalletMultiButton />
      </div>
    )
  } else {
    return ( 
      <div className = "App" >
        <div> 
          {!value && ( <button onClick = {createAccount} > create twitter account </button>)} 
          {!value && ( <button onClick = {updateAccount} > update twitter account </button>)} 
          {!value && ( <button onClick = {deleteAccount} > delete twitter account </button>)} 
        </div> 
        <div> 
          {!value && ( <button onClick = {sendTweet} > Send Tweet </button>)} 
          {!value && ( <button onClick = {updateTweet} > Update Tweet </button>)} 
          {!value && ( <button onClick = {deleteTweet} > Delete Tweet </button>)} 
          {value && <button onClick = {increment}> Increment counter</button>}
          {value && value >= Number(0) ? (<h2>{value} </h2>) : (<h3>Send a tweet.</h3>)} 
        </div> 
        <div className='Main-body'>
          <div className='col-md-3 col-sm-4 col-xs-12'>
            <div className='Twitter-Users-Box'>
              <ul>
                {
                  this.state.twitterUser.map(function(item) {
                    <li>
                      <label>{item}</label>
                      <p></p>
                    </li>
                  })
                }
              </ul>
            </div>
          </div>
          <div className='col-md-9 col-sm-8 col-xs-12'>
            <div className='Twitter-Tweets-Box'>
              
            </div>
          </div>
        </div>
      </div>
      );
    }
  }

  /* wallet configuration as specified here: https://github.com/solana-labs/wallet-adapter#setup */
  const AppWithProvider = () => ( 
    <ConnectionProvider endpoint = "https://api.devnet.solana.com" >
    <WalletProvider wallets = {
      wallets
    }
    autoConnect >
    <WalletModalProvider >
    <App />
    </WalletModalProvider> </WalletProvider> </ConnectionProvider>
  )

  export default AppWithProvider;
