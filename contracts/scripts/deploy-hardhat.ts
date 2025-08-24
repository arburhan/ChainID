import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("🚀 Deploying contracts with account:", deployer.address);
  console.log("💰 Account balance:", (await deployer.provider?.getBalance(deployer.address))?.toString());

  try {
    // Deploy IdentityContract
    console.log("\n📋 Deploying IdentityContract...");
    const Identity = await ethers.getContractFactory("IdentityContract");
    const identity = await Identity.deploy(deployer.address);
    await identity.waitForDeployment();
    console.log("✅ IdentityContract deployed to:", await identity.getAddress());

    // Deploy CredentialContract
    console.log("\n🎫 Deploying CredentialContract...");
    const Credential = await ethers.getContractFactory("CredentialContract");
    const credential = await Credential.deploy(await identity.getAddress());
    await credential.waitForDeployment();
    console.log("✅ CredentialContract deployed to:", await credential.getAddress());

    // Deploy AccessControlContract
    console.log("\n🔐 Deploying AccessControlContract...");
    const AccessCtrl = await ethers.getContractFactory("AccessControlContract");
    const accessCtrl = await AccessCtrl.deploy(deployer.address);
    await accessCtrl.waitForDeployment();
    console.log("✅ AccessControlContract deployed to:", await accessCtrl.getAddress());

    // Deploy AuditContract
    console.log("\n📊 Deploying AuditContract...");
    const Audit = await ethers.getContractFactory("AuditContract");
    const audit = await Audit.deploy();
    await audit.waitForDeployment();
    console.log("✅ AuditContract deployed to:", await audit.getAddress());

    // Deploy MockVerifier
    console.log("\n🧪 Deploying MockVerifier...");
    const Mock = await ethers.getContractFactory("MockVerifier");
    const mock = await Mock.deploy();
    await mock.waitForDeployment();
    console.log("✅ MockVerifier deployed to:", await mock.getAddress());

    // Set verifier on AccessControlContract
    console.log("\n🔗 Setting verifier on AccessControlContract...");
    const tx = await accessCtrl.setVerifier(await mock.getAddress());
    await tx.wait();
    console.log("✅ Verifier set successfully");

    // Summary
    console.log("\n🎉 Deployment Summary:");
    console.log("=========================");
    console.log("IdentityContract:", await identity.getAddress());
    console.log("CredentialContract:", await credential.getAddress());
    console.log("AccessControlContract:", await accessCtrl.getAddress());
    console.log("AuditContract:", await audit.getAddress());
    console.log("MockVerifier:", await mock.getAddress());
    console.log("\n✨ All contracts deployed successfully!");

    // Save addresses to a file
    const addresses = {
      IdentityContract: await identity.getAddress(),
      CredentialContract: await credential.getAddress(),
      AccessControlContract: await accessCtrl.getAddress(),
      AuditContract: await audit.getAddress(),
      MockVerifier: await mock.getAddress(),
      deploymentTime: new Date().toISOString()
    };

    console.log("\n📝 Contract addresses saved to deployment-addresses.json");
    console.log("Copy these addresses to your .env file:");

    console.log("\n# Contract Addresses");
    console.log(`IDENTITY_CONTRACT_ADDRESS=${addresses.IdentityContract}`);
    console.log(`CREDENTIAL_CONTRACT_ADDRESS=${addresses.CredentialContract}`);
    console.log(`ACCESS_CONTROL_CONTRACT_ADDRESS=${addresses.AccessControlContract}`);
    console.log(`AUDIT_CONTRACT_ADDRESS=${addresses.AuditContract}`);
    console.log(`MOCK_VERIFIER_ADDRESS=${addresses.MockVerifier}`);

  } catch (error) {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
