import Principal "mo:base/Principal";
import Time "mo:base/Time";
import Nat "mo:base/Nat";
import Array "mo:base/Array";

actor class PeduliCarbon() = this {
  type NFTDetail = {
    id: Text;
    owner: Principal;
    mission_id: Nat;
    carbon_amount: Float;
    timestamp: Int;
  };
  stable var nfts : [NFTDetail] = [];

  public shared({caller}) func verify_action(user: Principal, mission_id: Nat, proof_url: Text, gps: Text) : async Bool {
    // Dummy: always true
    true
  };

  public shared({caller}) func mint_nft(user: Principal, mission_id: Nat, carbon_amount: Float) : async Text {
    let id = "NFT-" # Nat.toText(nfts.size());
    let nft = {
      id = id;
      owner = user;
      mission_id = mission_id;
      carbon_amount = carbon_amount;
      timestamp = Time.now();
    };
    nfts := Array.append(nfts, [nft]);
    id
  };

  public query func get_user_nfts(user: Principal) : async [Text] {
    var result : [Text] = [];
    for (nft in nfts) {
      if (nft.owner == user) {
        result := Array.append(result, [nft.id]);
      }
    };
    result
  };

  public query func get_nft_detail(nft_id: Text) : async ?NFTDetail {
    var result : ?NFTDetail = null;
    for (nft in nfts) {
      if (nft.id == nft_id) { result := ?nft }
    };
    result
  };
} 