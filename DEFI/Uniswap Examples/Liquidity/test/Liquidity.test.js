const Liquidity = artifacts.require("Liquidity");
const IERC20 = artifacts.require("IERC20");
const Whale = "0x19184aB45C40c2920B0E0e31413b9434ABD243eD";
const Aave = "0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9";
const Enj = "0xf629cbd94d3791c9250152bd8dfbdf380e2a3b9c";
const Weth = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
const {time} = require("@openzeppelin/test-helpers");
const Amount = web3.utils.toBN(Math.pow(10,18));
const Amount2 = web3.utils.toBN(Math.pow(10,20));

contract("Liquidity test", (accounts) => {


    it("Add-remove liquidity", async () => {
        const liquidity = await Liquidity.new();
        const AaveToken = await IERC20.at(Aave);
        const EnjToken = await IERC20.at(Enj);

        const pair = await liquidity.getPair(Aave,Enj);
        const lpToken = await IERC20.at(pair);

        await AaveToken.transfer(liquidity.address,Amount,{from:Whale});

        await EnjToken.transfer(liquidity.address,Amount2,{from:Whale});

        let aaveBalance = await AaveToken.balanceOf(liquidity.address);
        let enjBalance = await EnjToken.balanceOf(liquidity.address);
        let lpBalance = await lpToken.balanceOf(liquidity.address);
        console.log(`Aave balance before addLiquidity: ${aaveBalance}`);
        console.log(`Enj balance before  addLiquidity: ${enjBalance}`);
        console.log(`Lp token balance before addLiquidity:${lpBalance}`);
        console.log("----------------------------------------------------")

        await liquidity.addTokenLiquidity(
            Aave,
            Enj,
            Amount,
            Amount2,
            0,
            0
        );

        aaveBalance = await AaveToken.balanceOf(liquidity.address);
        enjBalance = await EnjToken.balanceOf(liquidity.address);
        lpBalance = await lpToken.balanceOf(liquidity.address);
        console.log(`Aave balance after addLiquidity: ${aaveBalance}`);
        console.log(`Enj balance after  addLiquidity: ${enjBalance}`);
        console.log(`Lp token balance after addLiquidity: ${lpBalance}`);
        console.log("----------------------------------------------------")

        await time.increase(time.duration.years(2));

        await liquidity.removeTokenLiquidity(
            Aave,
            Enj,
            0,
            0);
        aaveBalance = await AaveToken.balanceOf(liquidity.address);
        enjBalance = await EnjToken.balanceOf(liquidity.address);
        lpBalance = await lpToken.balanceOf(liquidity.address);
        console.log(`Aave balance after removeLiquidity: ${aaveBalance}`);
        console.log(`Enj balance after  removeLiquidity: ${enjBalance}`);
        console.log(`Lp token balance after removeLiquidity:${lpBalance}`);
        
    })

    it("add-remove ETH liquidity", async () => {
        const liquidity = await Liquidity.new();
        const AaveToken = await IERC20.at(Aave);

        const pair = await liquidity.getPair(Aave,Weth);
        const lpToken = await IERC20.at(pair);
        web3.eth.sendTransaction({from:accounts[0],to:liquidity.address,value:web3.utils.toWei("1","ether")});

        await AaveToken.transfer(liquidity.address,Amount2,{from:Whale});

        let ethBalance = await web3.eth.getBalance(liquidity.address);
        let aaveBalance = await AaveToken.balanceOf(liquidity.address);
        let lpBalance = await lpToken.balanceOf(liquidity.address);
        console.log(`ETH balance before  addETHLiquidity: ${ethBalance}`);
        console.log(`Aave balance before addETHLiquidity: ${aaveBalance}`);
        console.log(`Lp token balance before addETHLiquidity: ${lpBalance}`);
        console.log("----------------------------------------------------")

        await liquidity.addETHLiquidity(      
            Aave,
            Amount2,
            Amount
        );

        ethBalance = await web3.eth.getBalance(liquidity.address);
        aaveBalance = await AaveToken.balanceOf(liquidity.address);
        lpBalance = await lpToken.balanceOf(liquidity.address);
        console.log(`ETH balance after  addETHLiquidity: ${ethBalance}`);
        console.log(`Aave balance after addETHLiquidity: ${aaveBalance}`);
        console.log(`Lp token balance after addETHLiquidity: ${lpBalance}`);
        console.log("----------------------------------------------------")

        await liquidity.removeETHLiquidity(
            Aave,
            Weth
        )

        ethBalance = await web3.eth.getBalance(liquidity.address);
        aaveBalance = await AaveToken.balanceOf(liquidity.address);
        lpBalance = await lpToken.balanceOf(liquidity.address);
        console.log(`ETH balance after  removeETHLiquidity: ${ethBalance}`);
        console.log(`Aave balance after removeETHLiquidity: ${aaveBalance}`);
        console.log(`Lp token balance after removeETHLiquidity: ${lpBalance}`);
        console.log("----------------------------------------------------")

    })
})
