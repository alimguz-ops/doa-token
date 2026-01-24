import hardhat from "hardhat";
const { ethers } = hardhat;
import { expect } from "chai";

describe("DoaToken", function () {
  let DoaToken, doa, owner, addr1, addr2;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    DoaToken = await ethers.getContractFactory("DoaToken");
    doa = await DoaToken.deploy(1000000);
    await doa.deployed();
  });

  it("Debe asignar el supply inicial al owner", async function () {
    const ownerBalance = await doa.balanceOf(owner.address);
    expect(await doa.totalSupply()).to.equal(ownerBalance);
  });

  it("Debe transferir tokens entre cuentas", async function () {
    await doa.transfer(addr1.address, 50);
    expect(await doa.balanceOf(addr1.address)).to.equal(50);

    await doa.connect(addr1).transfer(addr2.address, 50);
    expect(await doa.balanceOf(addr2.address)).to.equal(50);
  });

  it("Debe fallar si no hay balance suficiente", async function () {
    const initialOwnerBalance = await doa.balanceOf(owner.address);

    await expect(
      doa.connect(addr1).transfer(owner.address, 1)
    ).to.be.revertedWith("ERC20: transfer amount exceeds balance");

    expect(await doa.balanceOf(owner.address)).to.equal(initialOwnerBalance);
  });
});
