import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { Signer } from "ethers";

describe("RewardToken", function () {
  async function deployments() {
    const Signers: Signer[] = await ethers.getSigners();
    const Owner: Signer = Signers[0];
    const User: Signer = Signers[1];

    const INITIAL_AMOUNT_TO_MINT = "0";

    const rewardToken = await ethers.deployContract("RewardToken", [
      "RewardToken",
      "RT",
      Owner.getAddress(),
    ]);
    rewardToken.waitForDeployment();
    const INITIAL_BALANCE = await rewardToken.totalSupply();

    return {
      rewardToken,
      Owner,
      User,
      INITIAL_AMOUNT_TO_MINT,
      INITIAL_BALANCE,
    };
  }

  describe("Deployment", function () {
    it("Should set the right Owner", async function () {
      const { rewardToken, Owner } = await loadFixture(deployments);

      expect(await Owner.getAddress()).to.equal(await rewardToken.owner());
    });

    it("Initial balance should be 0", async function () {
      const { INITIAL_BALANCE, INITIAL_AMOUNT_TO_MINT } = await loadFixture(
        deployments
      );

      expect(INITIAL_AMOUNT_TO_MINT).to.equal(INITIAL_BALANCE);
    });
  });

  describe("Minting & Burning flow", function () {
    it("Should mint tokens", async function () {
      const { rewardToken, User } = await loadFixture(deployments);

      const amountToMint = ethers.parseEther("100");
      await expect(
        await rewardToken.mint(await User.getAddress(), amountToMint)
      )
        .to.emit(rewardToken, "Minted")
        .withArgs(ethers.ZeroAddress, await User.getAddress(), amountToMint);
      expect(await rewardToken.balanceOf(await User.getAddress())).to.equal(
        amountToMint
      );
    });

    it("Should burn tokens and emit burned event", async function () {
      const { rewardToken, Owner } = await loadFixture(deployments);

      const amountToMint = ethers.parseEther("1000");
      await rewardToken.mint(await Owner.getAddress(), amountToMint);

      const amountToBurn = ethers.parseEther("50");
      await expect(rewardToken.burn(amountToBurn))
        .to.emit(rewardToken, "Burned")
        .withArgs(await Owner.getAddress(), ethers.ZeroAddress, amountToBurn);
      expect(await rewardToken.balanceOf(Owner.getAddress())).to.equal(
        amountToMint - amountToBurn
      );
    });
  });

  describe("Restriction if not Owner", async function () {
    it("User tries to mint for himself", async function () {
      const { rewardToken, User } = await loadFixture(deployments);
      const amountToMint = ethers.parseEther("1000");

      await expect(
        rewardToken.connect(User).mint(await User.getAddress(), amountToMint)
      ).to.be.rejected;
    });

    it("User Tries to burn his own tokens", async function () {
      const { rewardToken, User } = await loadFixture(deployments);
      const amountToMint = ethers.parseEther("1000");
      await rewardToken.mint(await User.getAddress(), amountToMint);

      const amountToBurn = ethers.parseEther("1000");
      await expect(rewardToken.connect(User).burn(amountToBurn)).to.be.rejected;
    });
  });

  describe("Complete flow", async function () {
    it("Mint + Transfer + Burn", async function () {
      const { rewardToken, Owner, User, INITIAL_BALANCE } = await loadFixture(
        deployments
      );
      const amountToMint = ethers.parseEther("1000");
      const amountToBurn = ethers.parseEther("500");
      await rewardToken.mint(await User.getAddress(), amountToMint);

      await rewardToken
        .connect(User)
        .transfer(await Owner.getAddress(), amountToBurn);

      await rewardToken.burn(amountToBurn);

      expect(await rewardToken.totalSupply()).to.be.equal(
        INITIAL_BALANCE + amountToMint - amountToBurn
      );

      expect(await rewardToken.balanceOf(await Owner.getAddress())).to.be.equal(
        0
      );
      expect(await rewardToken.balanceOf(await User.getAddress())).to.be.equal(
        amountToMint - amountToBurn
      );
    });
  });
});
