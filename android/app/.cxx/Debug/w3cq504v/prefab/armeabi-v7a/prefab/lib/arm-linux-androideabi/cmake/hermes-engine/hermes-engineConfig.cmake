if(NOT TARGET hermes-engine::hermesvm)
add_library(hermes-engine::hermesvm SHARED IMPORTED)
set_target_properties(hermes-engine::hermesvm PROPERTIES
    IMPORTED_LOCATION "/Users/sitrancelik/.gradle/caches/9.0.0/transforms/2b2a34f399e6566a4bc7f9555d03a28a/transformed/hermes-android-0.82.1-debug/prefab/modules/hermesvm/libs/android.armeabi-v7a/libhermesvm.so"
    INTERFACE_INCLUDE_DIRECTORIES "/Users/sitrancelik/.gradle/caches/9.0.0/transforms/2b2a34f399e6566a4bc7f9555d03a28a/transformed/hermes-android-0.82.1-debug/prefab/modules/hermesvm/include"
    INTERFACE_LINK_LIBRARIES ""
)
endif()

