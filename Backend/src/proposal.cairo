use core::dict::Felt252Dict;
use core::nullable::{NullableTrait, match_nullable, FromNullableResult};

#[derive(Drop, PartialEq, Clone, Serde, Destruct, Copy)]
enum ProposalState {
    draft, 
    in_votation, 
    finalized
}

#[derive(Drop, PartialEq, Clone, Serde, Destruct, Copy)]
struct ProposalVoterStruct {
    has_voted: bool,
    rol: felt252
}

#[derive(Copy, Drop)]
struct ProposalVoteTypeStruct {
    vote_type: felt252,
    count: u256
}

struct Proposal {
    id: felt252,
    name: felt252,
    state: ProposalState,
    type_votes: Array<ProposalVoteTypeStruct>,
    voters: Felt252Dict<Nullable<ProposalVoterStruct>>
}

impl ProposalDestruct<ProposalVoterStruct, +Drop<ProposalVoterStruct>, +Drop<Felt252Dict<u256>>, +Destruct<Felt252Dict<u256>>, +Felt252DictValue<ProposalVoterStruct>> of Destruct<Proposal> {
    fn destruct(self: Proposal) nopanic {
        self.voters.squash();
    }
}


pub trait ProposalTrait {
    fn create_proposal(id: felt252, name: felt252) -> Proposal;
    fn add_vote_type(ref self: Proposal, vote_type: felt252);
    fn remove_vote_type(ref self: Proposal, vote_type: felt252);
    fn add_voter(ref self: Proposal, wallet_id: felt252, rol: felt252);
    fn get_voter(ref self: Proposal, wallet_id: felt252) -> Option<ProposalVoterStruct>;
    fn remove_voter(ref self: Proposal, wallet_id: felt252);
}

impl ProposalImpl<+Drop<Proposal>, +Copy<Proposal>> of ProposalTrait {
    fn create_proposal(id: felt252, name: felt252) -> Proposal {
        Proposal {
            id: id,
            name: name,
            state: ProposalState::draft,
            type_votes: Default::default(),
            voters: Default::default()
        }
    }

    fn add_vote_type(ref self: Proposal, vote_type: felt252) {
        let temp = ProposalVoteTypeStruct {
            vote_type: vote_type,
            count: 0
        };
        self.type_votes.append(temp);
    }

    fn remove_vote_type(ref self: Proposal, vote_type: felt252) {
        let mut vote_types = ArrayTrait::<ProposalVoteTypeStruct>::new();
        let mut idx = 0;
        while idx < self.type_votes.len() {
            let temp = *self.type_votes[idx];
            if temp.vote_type != vote_type {
                vote_types.append(temp);
            };
            idx += 1;
        };
        self.type_votes = vote_types;
    }

    fn add_voter(ref self: Proposal, wallet_id: felt252, rol: felt252) {
        let new_voter = ProposalVoterStruct {
            has_voted: false,
            rol: rol,
        };
        self.voters.insert(wallet_id, NullableTrait::new(new_voter));
    }

    fn get_voter(ref self: Proposal, wallet_id: felt252) -> Option<ProposalVoterStruct> {
        let voter = self.voters.get(wallet_id).deref();
        if voter.rol != 'none' {
            return Option::None;
        } else {
            return Option::Some(voter);
        }
    }

    fn remove_voter(ref self: Proposal, wallet_id: felt252) {
        let new_voter = ProposalVoterStruct {
            has_voted: false,
            rol: 'none',
        };
        self.voters.insert(wallet_id, NullableTrait::new(new_voter));
    }
}