import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deployer:", deployer.address);

  const Identity = await ethers.getContractFactory("IdentityContract");
  const identity = await Identity.deploy(deployer.address);
  await identity.waitForDeployment();
  console.log("IdentityContract:", await identity.getAddress());

  const Credential = await ethers.getContractFactory("CredentialContract");
  const credential = await Credential.deploy(await identity.getAddress());
  await credential.waitForDeployment();
  console.log("CredentialContract:", await credential.getAddress());

  const AccessCtrl = await ethers.getContractFactory("AccessControlContract");
  const accessCtrl = await AccessCtrl.deploy(deployer.address);
  await accessCtrl.waitForDeployment();
  console.log("AccessControlContract:", await accessCtrl.getAddress());

  const Audit = await ethers.getContractFactory("AuditContract");
  const audit = await Audit.deploy();
  await audit.waitForDeployment();
  console.log("AuditContract:", await audit.getAddress());

  const Mock = await ethers.getContractFactory("MockVerifier");
  const mock = await Mock.deploy();
  await mock.waitForDeployment();
  console.log("MockVerifier:", await mock.getAddress());

  const tx = await accessCtrl.setVerifier(await mock.getAddress());
  await tx.wait();
  console.log("Verifier set on AccessControlContract");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
