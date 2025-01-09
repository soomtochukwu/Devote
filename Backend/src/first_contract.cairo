#[starknet::interface]
pub trait ICounterContract<TContractState> {
    fn get_counter(self: @TContractState) -> u32;
    fn increment_counter(ref self: TContractState);
}



#[use starknet::contract]
mod CounterContract {
    
    #[storage]
    struct Storage {
        counter: u32,
    }

    #[constructor]
    fn constructor(ref self: ContractState, initial_value: u32) {
        self.counter.write(initial_value);
    }

    #[abi(embed_v0)]
    impl CounterContract of super::IContractContract<ContractState>{

        fn get_counter(self: @ContractState) -> u32 {
            self.counter.read()
        }
        fn increment_counter(ref self: ContractState) {
            self.counter.write(self.counter.read() + 1);
        }
        
    }
}
