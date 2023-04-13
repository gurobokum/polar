import placeholderAvatar from './placeholder_avatar.png'

const PolarBadge = ({ showAmount }: { showAmount: boolean }) => {
  return (
    <div className="flex h-12 w-fit min-w-[550px] items-center space-x-6 rounded-lg px-4 py-2 text-sm shadow-[0_0_15px_-5px_rgba(0,0,0,0.3)]">
      <div className="font-medium">Polar</div>
      <div className="text-black/50">Open source funding</div>
      <div
        className={`rounded-xl border-[1px] border-[#FAE7AC] bg-[#FFF0C0] px-2 py-1 text-black/50 transition-opacity duration-100 ease-in  ${
          showAmount ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <span>
          <strong className="font-medium text-black">$250</strong> raised
        </span>
      </div>
      <div className="flex-1"></div>
      <img className="h-8 w-8 rounded-full" src={placeholderAvatar.src} />
      <div className="rounded-md bg-[#7D7D7D] px-3 py-1 text-white">
        Back issue
      </div>
    </div>
  )
}

export default PolarBadge
