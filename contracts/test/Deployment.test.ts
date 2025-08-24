import { expect } from "chai";
import { ethers } from "hardhat";

describe("ChainID Contract Deployment", function () {
  let deployer: any;
  let identityContract: any;
  let credentialContract: any;
  let accessControlContract: any;
  let auditContract: any;
  let mockVerifier: any;

  beforeEach(async function () {
    [deployer] = await ethers.getSigners();
  });

  it("Should deploy all contracts successfully", async function () {
    // Deploy IdentityContract
    const Identity = await ethers.getContractFactory("IdentityContract");
    identityContract = await Identity.deploy(deployer.address);
    await identityContract.waitForDeployment();
    expect(await identityContract.getAddress()).to.be.properAddress;

    // Deploy CredentialContract
    const Credential = await ethers.getContractFactory("CredentialContract");
    credentialContract = await Credential.deploy(await identityContract.getAddress());
    await credentialContract.waitForDeployment();
    expect(await credentialContract.getAddress()).to.be.properAddress;

    // Deploy AccessControlContract
    const AccessCtrl = await ethers.getContractFactory("AccessControlContract");
    accessControlContract = await AccessCtrl.deploy(deployer.address);
    await accessControlContract.waitForDeployment();
    expect(await accessControlContract.getAddress()).to.be.properAddress;

    // Deploy AuditContract
    const Audit = await ethers.getContractFactory("AuditContract");
    auditContract = await Audit.deploy();
    await auditContract.waitForDeployment();
    expect(await auditContract.getAddress()).to.be.properAddress;

    // Deploy MockVerifier
    const Mock = await ethers.getContractFactory("MockVerifier");
    mockVerifier = await Mock.deploy();
    await mockVerifier.waitForDeployment();
    expect(await mockVerifier.getAddress()).to.be.properAddress;
  });

  it("Should set verifier on AccessControlContract", async function () {
    // This test requires the contracts to be deployed first
    if (!accessControlContract || !mockVerifier) {
      this.skip();
    }

    const tx = await accessControlContract.setVerifier(await mockVerifier.getAddress());
    await tx.wait();
    
    const verifier = await accessControlContract.zkVerifier();
    expect(verifier).to.equal(await mockVerifier.getAddress());
  });

  it("Should have correct initial roles", async function () {
    if (!identityContract) {
      this.skip();
    }

    // Check if deployer has DEFAULT_ADMIN_ROLE
    const defaultAdminRole = await identityContract.DEFAULT_ADMIN_ROLE();
    expect(await identityContract.hasRole(defaultAdminRole, deployer.address)).to.be.true;

    // Check if deployer has GOVERNMENT_ROLE
    const governmentRole = await identityContract.GOVERNMENT_ROLE();
    expect(await identityContract.hasRole(governmentRole, deployer.address)).to.be.true;
  });
});
