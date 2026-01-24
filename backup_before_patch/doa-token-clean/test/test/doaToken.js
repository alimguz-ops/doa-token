import hardhat from "hardhat";
const { ethers } = hardhat;
import { expect } from "chai";

describe("DoaToken", function () {
  let DoaToken, doa, owner, addr1, addr2;

  beforeEach(async function () {
    // Obtiene las cuentas de prueba
    [owner, addr1, addr2] = await ethers.getSigners();

    // Crea la fábrica del contrato
    DoaToken = await ethers.getContractFactory("DoaToken");

    // Despliega el contrato con un supply inicial
    doa = await DoaToken.deploy(1000000);
    await doa.deployed();
  });

  it("Debe asignar el supply inicial al owner", async function () {
    const ownerBalance = await doa.balanceOf(owner.address);
    expect(await doa.totalSupply()).to.equal(ownerBalance);
  });

  it("Debe transferir tokens entre cuentas", async function () {
    // Transferir 50 tokens del owner a addr1
    await doa.transfer(addr1.address, 50);
    expect(await doa.balanceOf(addr1.address)).to.equal(50);

    // Transferir 50 tokens de addr1 a addr2
    await doa.connect(addr1).transfer(addr2.address, 50);
    expect(await doa.balanceOf(addr2.address)).to.equal(50);
  });

  it("Debe fallar si no hay balance suficiente", async function () {
    const initialOwnerBalance = await doa.balanceOf(owner.address);

    // addr1 intenta transferir más tokens de los que tiene
    await expect(
      doa.connect(addr1).transfer(owner.address, 1)
    ).to.be.revertedWith("ERC20: transfer amount exceeds balance");

    // El balance del owner no cambia
    expect(await doa.balanceOf(owner.address)).to.equal(initialOwnerBalance);
  });
});
