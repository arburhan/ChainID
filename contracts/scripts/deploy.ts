import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deployer:", deployer.address);

  const Identity = await ethers.getContractFactory("IdentityContract");
  const identity = await Identity.deploy(deployer.address);
  await identity.deployed();
  console.log("IdentityContract:", identity.address);

  const Credential = await ethers.getContractFactory("CredentialContract");
  const credential = await Credential.deploy(identity.address);
  await credential.deployed();
  console.log("CredentialContract:", credential.address);

  const AccessCtrl = await ethers.getContractFactory("AccessControlContract");
  const accessCtrl = await AccessCtrl.deploy(deployer.address);
  await accessCtrl.deployed();
  console.log("AccessControlContract:", accessCtrl.address);

  const Audit = await ethers.getContractFactory("AuditContract");
  const audit = await Audit.deploy();
  await audit.deployed();
  console.log("AuditContract:", audit.address);

  const Mock = await ethers.getContractFactory("MockVerifier");
  const mock = await Mock.deploy();
  await mock.deployed();
  console.log("MockVerifier:", mock.address);

  const tx = await accessCtrl.setVerifier(mock.address);
  await tx.wait();
  console.log("Verifier set on AccessControlContract");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
